// background.js

// List of URL patterns where the content script should be injected
const urlPatterns = [
  "*://*.qdiak.hu/*",
  "*://*.gitpod.io/*"
];

// Function to check if a URL matches our criteria
function urlMatches(url) {
  return urlPatterns.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(url);
  });
}

// Function to inject the content script into the given tab
function injectContentScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error injecting content script:', chrome.runtime.lastError);
    } else {
      console.log('Content script injected into tab:', tabId);
    }
  });

  // Inject the CSS file
  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    files: ["styles.css"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error injecting CSS:', chrome.runtime.lastError);
    } else {
      console.log('CSS injected into tab:', tabId);
    }
  });
}

// Listen for history state updates (SPA navigation)
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (urlMatches(details.url)) {
    injectContentScript(details.tabId);
  }
});

// Listen for tab updates (including initial page loads)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && urlMatches(tab.url)) {
    injectContentScript(tabId);
  }
});

// Log when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Toborzas Extension installed');
});
