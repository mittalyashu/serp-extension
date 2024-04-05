// 1 seconds (1000 ms)
const defaultSpeed = 1000;

function getStorageValue(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        chrome.storage.local.set({ [key]: defaultSpeed }, function () {
          resolve(defaultSpeed);
        });
      } else {
        resolve(result[key]);
      }
    });
  });
}

[
  "redditSpeed",
  "mediumSpeedEachClap",
  "mediumSpeedEachArticle",
  "mediumSpeedPageScroll",
].map(async (key) => {
  if (key === "redditSpeed") {
    console.log(key);
    console.log(await getStorageValue(key));
  }

  const val = document.getElementById(key);
  val.value = await getStorageValue(key);
});

[
  "redditSpeedBtn",
  "mediumSpeedEachClapBtn",
  "mediumSpeedEachArticleBtn",
  "mediumSpeedPageScrollBtn",
].map((key) => {
  document.getElementById(key).onclick = function () {
    const storageKey = key.replace("Btn", "");

    var speed = document.getElementById(storageKey).value;
    chrome.storage.local.set({ [storageKey]: speed }, function () {
      console.log(storageKey, "speed set to " + speed);
    });
  };
});

const redditBtn = document.getElementById("redditBtn");
redditBtn.onclick = startReddit;
const mediumBtn = document.getElementById("mediumBtn");
mediumBtn.onclick = startMedium;

let activePlatform;
chrome.storage.local.get(["activePlatform"], function (result) {
  resetBtnState();

  activePlatform = result.activePlatform;
  if (activePlatform === "reddit") {
    redditBtn.removeAttribute("disabled");
  } else if (activePlatform === "medium") {
    mediumBtn.removeAttribute("disabled");
  }
});

function resetBtnState() {
  redditBtn.setAttribute("disabled", "disabled");
  mediumBtn.setAttribute("disabled", "disabled");
}

let activeTabId = "";
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  activeTabId = activeTab.id;
});

function startReddit() {
  if (!activeTabId) {
    console.log("Active Tab ID missing!");
    return;
  }

  chrome.scripting.executeScript(
    {
      target: { tabId: activeTabId },
      files: ["js/reddit.js"],
    },
    function () {
      redditBtn.innerHTML = "Stop";
      redditBtn.onclick = stopScriptExecution;
    }
  );
}

function startMedium() {
  if (!activeTabId) {
    console.log("Active Tab ID missing!");
    return;
  }

  chrome.scripting.executeScript(
    {
      target: { tabId: activeTabId },
      files: ["js/medium.js"],
    },
    function () {
      mediumBtn.innerHTML = "Stop";
      mediumBtn.onclick = stopScriptExecution;
    }
  );
}

function stopScriptExecution() {
  console.log("Stop script execution");
  chrome.tabs.sendMessage(activeTabId, {
    message: "___clapper_stop_script",
  });

  if (activePlatform === "reddit") {
    redditBtn.innerHTML = "Start";
    redditBtn.onclick = startReddit;
  } else if (activePlatform === "medium") {
    mediumBtn.innerHTML = "Start";
    mediumBtn.onclick = startMedium;
  }
}
