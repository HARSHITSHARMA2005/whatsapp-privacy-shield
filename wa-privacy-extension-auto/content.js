// WhatsApp Privacy Shield — Auto Mode
(function () {
  let isScreenSharing = false;
  let manualOverride = null;

  // ── Inject CSS directly via JS (bypasses content script CSS injection issues) ──
  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'wa-privacy-shield-css';
    style.textContent = `
      body.wa-privacy-on [data-testid="chat-list"] [role="listitem"],
      body.wa-privacy-on [data-testid="chat-list"] [data-testid="cell-frame-container"] {
        filter: blur(6px) !important;
        transition: filter 0.2s ease;
        user-select: none;
      }
      body.wa-privacy-on [data-testid="chat-list"] [role="listitem"]:hover,
      body.wa-privacy-on [data-testid="chat-list"] [data-testid="cell-frame-container"]:hover {
        filter: blur(0px) !important;
      }
      body.wa-privacy-on #main [role="row"],
      body.wa-privacy-on #main [data-testid="msg-container"],
      body.wa-privacy-on #main .message-in,
      body.wa-privacy-on #main .message-out,
      body.wa-privacy-on #main [class*="message-"],
      body.wa-privacy-on #main [data-testid*="msg-"] {
        filter: blur(5px) !important;
        transition: filter 0.15s ease;
        user-select: none;
      }
      body.wa-privacy-on #main [role="row"]:hover,
      body.wa-privacy-on #main [data-testid="msg-container"]:hover,
      body.wa-privacy-on #main .message-in:hover,
      body.wa-privacy-on #main .message-out:hover,
      body.wa-privacy-on #main [class*="message-"]:hover,
      body.wa-privacy-on #main [data-testid*="msg-"]:hover {
        filter: blur(0px) !important;
      }
      body.wa-privacy-on #main header { filter: none !important; }
      body.wa-privacy-on #main footer { filter: none !important; }
      body.wa-privacy-on #main [data-testid="conversation-compose-box"] { filter: none !important; }
      body.wa-privacy-on::after {
        content: "🛡️ Privacy Shield ON";
        position: fixed;
        bottom: 16px;
        right: 16px;
        background: rgba(18, 140, 126, 0.9);
        color: white;
        font-size: 12px;
        font-family: "Segoe UI", sans-serif;
        padding: 6px 12px;
        border-radius: 20px;
        z-index: 99999;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
    `;
    document.documentElement.appendChild(style);
  }

  chrome.storage.sync.get(["manualOverride"], (data) => {
    manualOverride = data.manualOverride ?? null;
    startMonitoring();
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SET_MANUAL_OVERRIDE") {
      manualOverride = msg.value;
      chrome.storage.sync.set({ manualOverride });
      applyPrivacy();
    }
    if (msg.type === "GET_STATUS") {
      sendStatusToPopup();
    }
  });

  function shouldBlur() {
    if (manualOverride !== null) return manualOverride;
    return isScreenSharing;
  }

  function applyPrivacy() {
    if (!document.body) return;
    if (shouldBlur()) {
      document.body.classList.add("wa-privacy-on");
    } else {
      document.body.classList.remove("wa-privacy-on");
    }
    sendStatusToPopup();
  }

  function sendStatusToPopup() {
    chrome.runtime.sendMessage({
      type: "STATUS_UPDATE",
      isScreenSharing,
      manualOverride,
      blurActive: shouldBlur(),
    }).catch(() => {});
  }

  function injectDetector() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("detector.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }

  function checkScreenShare() {
    const wasSharing = isScreenSharing;
    let detected = false;
    try {
      document.querySelectorAll("video").forEach(v => {
        if (v.srcObject) {
          v.srcObject.getVideoTracks().forEach(t => {
            if (t.getSettings().displaySurface) detected = true;
          });
        }
      });
    } catch (e) {}
    if (window.__waPrivacyScreenSharing) detected = true;
    isScreenSharing = detected;
    if (wasSharing !== isScreenSharing) applyPrivacy();
  }

  window.addEventListener("wa-screen-share-start", () => {
    isScreenSharing = true;
    applyPrivacy();
  });

  window.addEventListener("wa-screen-share-stop", () => {
    isScreenSharing = false;
    applyPrivacy();
  });

  const domObserver = new MutationObserver(() => {
    if (shouldBlur() && document.body) document.body.classList.add("wa-privacy-on");
  });

  function startObserver() {
    if (document.body) {
      domObserver.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        domObserver.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  function startMonitoring() {
    injectCSS();
    injectDetector();
    startObserver();
    applyPrivacy();
    setInterval(checkScreenShare, 2000);
  }

})();
