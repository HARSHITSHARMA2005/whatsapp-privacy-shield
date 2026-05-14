// Injected into page context to detect screen sharing
(function() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return;
  window.__waPrivacyScreenSharing = false;
  const orig = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getDisplayMedia = async function(...args) {
    const stream = await orig(...args);
    window.__waPrivacyScreenSharing = true;
    window.dispatchEvent(new CustomEvent('wa-screen-share-start'));
    stream.getVideoTracks().forEach(track => {
      track.addEventListener('ended', () => {
        window.__waPrivacyScreenSharing = false;
        window.dispatchEvent(new CustomEvent('wa-screen-share-stop'));
      });
    });
    return stream;
  };
})();
