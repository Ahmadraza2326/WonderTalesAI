const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_test_'));
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    'http://localhost:5173/academy/lesson/lesson_g2_array_multiplication'
  ]);

  console.log('Chrome spawned, waiting for port 9222...');
  let pages = null;
  for (let i = 0; i < 30; i++) {
    try {
      const listRes = await fetch('http://127.0.0.1:9222/json/list');
      if (listRes.ok) {
        pages = await listRes.json();
        if (pages && pages.length > 0) break;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 250));
    }
  }

  if (!pages) throw new Error('Chrome remote debugging did not respond');
  console.log('Pages:', pages.map(p => ({ title: p.title, url: p.url })));

  const targetPage = pages.find(p => p.url.includes('academy/lesson')) || pages[0];
  console.log('Connecting to:', targetPage.webSocketDebuggerUrl);

  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = e => {
    const data = JSON.parse(e.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data);
      callbacks.delete(data.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  console.log('Enabling Page & Runtime domains...');
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Waiting 3s for React to hydrate...');
  await new Promise(r => setTimeout(r, 3000));

  const title = await send('Runtime.evaluate', { expression: 'document.title' });
  console.log('Document title:', title.result?.result?.value);

  const bodySnippet = await send('Runtime.evaluate', {
    expression: 'document.body.innerText.slice(0, 150)'
  });
  console.log('Page body snippet:', bodySnippet.result?.result?.value);

  console.log('Capturing screenshot...');
  const res = await send('Page.captureScreenshot', { format: 'png' });
  if (res.result && res.result.data) {
    fs.writeFileSync('screenshots/test_render.png', Buffer.from(res.result.data, 'base64'));
    console.log('SUCCESS! Wrote screenshots/test_render.png (' + res.result.data.length + ' base64 chars)');
  } else {
    console.error('Failed to capture:', res);
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
