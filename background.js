chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ members: [] });
});

chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open();
});
