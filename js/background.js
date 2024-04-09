// background.js

function runNoFollowScript(tabId, tabUrl) {
  const url = new URL(tabUrl);
  const key = `___serp_ext_disable-noFollow-${url.host}`;

  chrome.storage.local.get([key], function (result) {
    if (result.hasOwnProperty(key)) {
    } else {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["js/executeScripts/noFollow.js"],
      });
    }
  });
}

function runSeeRobotsScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["js/executeScripts/seeRobots.js"],
  });

  chrome.tabs.sendMessage(
    tabId,
    {
      message: "___serp_ext_start_robots_tags",
    },
    function (response) {
      UpdateIcon(response, tabId);
    }
  );
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  if (!activeInfo.tabId) return false;

  chrome.tabs.get(activeInfo.tabId, function (tab) {
    var tabUrl = tab.url;

    if (tabUrl.startsWith("http://") || tabUrl.startsWith("https://")) {
      setActivePlatform(tabUrl);
      runNoFollowScript(tab.id, tabUrl);
      runSeeRobotsScript(tab.id);
    }
  });
});

function setActivePlatform(url) {
  let activePlatform = "";

  if (url.includes("medium.com")) {
    activePlatform = "medium";
  } else if (url.includes("new.reddit.com")) {
    activePlatform = "reddit";
  }

  chrome.storage.local.set({ activePlatform: activePlatform }, function () {
    console.log("Active platform is:", activePlatform);
  });
}

/**
 * Continue to run Amazon script in background on all sites.
 * NOTE: It may impact the performance of the browser.
 */
chrome.tabs.query({}, function (tabs) {
  tabs.forEach(function (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["js/amazon.js"],
    });
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading" || changeInfo.status === "complete") {
    if (!tabId) return false;

    if (tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
      runNoFollowScript(tabId, tab.url);
      runSeeRobotsScript(tabId);
    }
  }
});

function UpdateIcon(source, tabId) {
  if (source && Object.keys(source).length === 0) return;

  var output =
    (source.index == false ? "no" : "") +
    "index / " +
    (source.follow == false ? "no" : "") +
    "follow";
  var icon =
    "/images/" +
    (source.index == false ? "no" : "") +
    "index-" +
    (source.follow == false ? "no" : "") +
    "follow.png";

  chrome.action.setTitle({
    title: output,
    tabId,
  });
  chrome.action.setIcon({
    path: icon,
    tabId,
  });
}
