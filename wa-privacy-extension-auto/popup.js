const status = document.getElementById('status');

function setBlur(value) {
  chrome.storage.sync.set({ manualOverride: value });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) { status.textContent = 'No active tab found'; return; }
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (shouldBlur) => {
        if (shouldBlur === null) {
          // auto — just remove forced class
          document.body.classList.remove('wa-privacy-on');
        } else if (shouldBlur) {
          document.body.classList.add('wa-privacy-on');
        } else {
          document.body.classList.remove('wa-privacy-on');
        }
        return document.body.classList.contains('wa-privacy-on');
      },
      args: [value]
    }).then(results => {
      const active = results?.[0]?.result;
      status.textContent = active ? '🛡️ Shield is ON' : '👁️ Shield is OFF';
    }).catch(e => {
      status.textContent = 'Error: ' + e.message;
    });
  });
}

document.getElementById('btnOn').onclick   = () => setBlur(true);
document.getElementById('btnAuto').onclick = () => setBlur(null);
document.getElementById('btnOff').onclick  = () => setBlur(false);

status.textContent = 'Click a button to activate';
