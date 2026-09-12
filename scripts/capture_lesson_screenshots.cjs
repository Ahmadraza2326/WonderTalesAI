const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:9222/json/version');
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(200);
  }
  throw new Error('Could not connect to Chrome debugging port');
}

async function run() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_cdp_'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  console.log('Launching Chrome with remote debugging on port 9222...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  chrome.on('error', err => console.error('Chrome process error:', err));

  try {
    const browserWsUrl = await getDebuggerUrl();
    console.log('Connected to Chrome version:', browserWsUrl);

    // Create a new target page
    const newPageRes = await fetch('http://localhost:9222/json/new?http://localhost:5173/academy/lesson/lesson_g2_array_multiplication', { method: 'PUT' });
    const pageData = await newPageRes.json();
    const pageWsUrl = pageData.webSocketDebuggerUrl;
    console.log('Target Page WS:', pageWsUrl);

    const ws = new WebSocket(pageWsUrl);
    let idCounter = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = idCounter++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('Waiting 3s for React page hydration...');
    await sleep(3000);

    // Set Viewport 1280x900
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(500);

    // Take screenshot of Welcome Gate at 1280px
    console.log('Capturing Welcome Gate at 1280px...');
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/welcome_1280px.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved screenshots/welcome_1280px.png');

    // Set Viewport 768px (Tablet)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(300);
    const shotTablet = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/welcome_768px.png', Buffer.from(shotTablet.data, 'base64'));
    console.log('Saved screenshots/welcome_768px.png');

    // Set Viewport 430px (Mobile Large)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await sleep(300);
    const shotMobileLg = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/welcome_430px.png', Buffer.from(shotMobileLg.data, 'base64'));
    console.log('Saved screenshots/welcome_430px.png');

    // Set Viewport 375px (Mobile Standard)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await sleep(300);
    const shotMobileStd = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/welcome_375px.png', Buffer.from(shotMobileStd.data, 'base64'));
    console.log('Saved screenshots/welcome_375px.png');

    // Set Viewport 320px (Mobile Small)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 568,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await sleep(300);
    const shotMobileSm = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/welcome_320px.png', Buffer.from(shotMobileSm.data, 'base64'));
    console.log('Saved screenshots/welcome_320px.png');

    // Now switch back to 1280px to click "Begin Adventure"
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(300);

    // Click "Begin Adventure"
    console.log('Clicking "Begin Adventure"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Begin Adventure'));
        if (btn) { btn.click(); return 'clicked'; }
        return 'not_found';
      })()`
    });

    await sleep(1500);

    // Capture Scene 1 at 1280px and 375px
    console.log('Capturing Scene 1...');
    const shotScene1_1280 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/scene1_welcome_hook_1280px.png', Buffer.from(shotScene1_1280.data, 'base64'));

    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    await sleep(300);
    const shotScene1_375 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/scene1_welcome_hook_375px.png', Buffer.from(shotScene1_375.data, 'base64'));

    // Switch back to 1280 and click Continue to reach Scene 2
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(300);
    console.log('Advancing to Scene 2...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find(b => b.innerText.toLowerCase().includes('next') || b.innerText.toLowerCase().includes('continue') || b.innerText.toLowerCase().includes('let'));
        if (nextBtn) { nextBtn.click(); return 'clicked'; }
        return 'not_found';
      })()`
    });
    await sleep(1500);

    console.log('Capturing Scene 2...');
    const shotScene2_1280 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/scene2_visual_demo_1280px.png', Buffer.from(shotScene2_1280.data, 'base64'));

    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    await sleep(300);
    const shotScene2_375 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/scene2_visual_demo_375px.png', Buffer.from(shotScene2_375.data, 'base64'));

    // Advance to Scene 3
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(300);
    console.log('Advancing to Scene 3...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find(b => b.innerText.toLowerCase().includes('next') || b.innerText.toLowerCase().includes('continue') || b.innerText.toLowerCase().includes('ready'));
        if (nextBtn) { nextBtn.click(); return 'clicked'; }
        return 'not_found';
      })()`
    });
    await sleep(1500);

    console.log('Capturing Scene 3...');
    const shotScene3_1280 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/scene3_guided_practice_1280px.png', Buffer.from(shotScene3_1280.data, 'base64'));

    ws.close();
    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    chrome.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
