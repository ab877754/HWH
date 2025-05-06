let isLogging = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start-logging") {
    isLogging = true;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["logger.js"]
      });
    });
  } else if (message.action === "stop-logging") {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "stop-logging" });
    });
    isLogging = false;
  } else if (message.action === "download") {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: true
    });
  }
});
