const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const VIEWPORTS = [
  { name: 'mobile_320', width: 320, height: 640, scale: 2 },
  { name: 'mobile_360', width: 360, height: 780, scale: 2 },
  { name: 'mobile_390', width: 390, height: 844, scale: 3 },
  { name: 'tablet_768', width: 768, height: 1024, scale: 2 },
  { name: 'desktop_1280', width: 1280, height: 800, scale: 1 },
];

const ROUTES = [
  { path: '/overworld', name: 'Overworld' },
  { path: '/playroom', name: 'Playroom' },
  { path: '/academy', name: 'Academy' },
  { path: '/stories', name: 'Stories' },
];

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_qa_'));
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    'http://localhost:5173/overworld'
  ]);

  console.log('🚀 Chrome spawned. Locating overflowing elements across viewports...');
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

  const targetPage = pages.find(p => p.url.includes('localhost:5173')) || pages[0];
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

  await send('Page.enable');
  await send('Runtime.enable');

  for (const route of ROUTES) {
    console.log(`\n========================================`);
    console.log(`🌐 Inspecting Route: ${route.name} (${route.path})`);
    console.log(`========================================`);

    await send('Page.navigate', { url: `http://localhost:5173${route.path}` });
    await new Promise(r => setTimeout(r, 1500));

    for (const vp of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.scale,
        mobile: vp.width < 768,
      });

      await new Promise(r => setTimeout(r, 400));

      const inspectEval = await send('Runtime.evaluate', {
        expression: `(() => {
          const clientW = document.documentElement.clientWidth;
          const allEls = document.querySelectorAll('*');
          const overflowing = [];
          for (const el of allEls) {
            const rect = el.getBoundingClientRect();
            if (rect.right > clientW + 1.5) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                className: typeof el.className === 'string' ? el.className.slice(0, 60) : '',
                id: el.id,
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                diff: Math.round(rect.right - clientW)
              });
            }
          }
          return {
            clientW,
            scrollW: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
            overflowCount: overflowing.length,
            topOverflowing: overflowing.slice(0, 5)
          };
        })()`,
        returnByValue: true
      });

      const res = inspectEval.result?.result?.value;
      if (res?.overflowCount > 0) {
        console.log(`  📱 ${vp.name} (${vp.width}px): ${res.overflowCount} overflowing elements! Max Diff: +${res.topOverflowing[0]?.diff}px`);
        for (const item of res.topOverflowing) {
          console.log(`     -> <${item.tag} class="${item.className}" id="${item.id}"> width=${item.width}px right=${item.right}px`);
        }
      } else {
        console.log(`  📱 ${vp.name} (${vp.width}px): ✅ Clean. Zero overflow.`);
      }
    }
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
