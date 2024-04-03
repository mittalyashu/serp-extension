function getActiveTagId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      if (activeTab) {
        resolve(activeTab.id);
      } else {
        reject(new Error('No active tab found.'));
      }
    });
  });
}

const noFollowBtn = document.getElementById("noFollowBtn");
noFollowBtn.onclick = enableNoFollow;

async function enableNoFollow() {
  const activeTabId = await getActiveTagId();
  if (!activeTabId) {
    return;
  }

  chrome.scripting.executeScript(
    {
      target: { tabId: activeTabId },
      files: ["js/executeScripts/noFollow.js"],
    },
    function () {
      noFollowBtn.innerHTML = "Disable";
      noFollowBtn.onclick = disableNoFollow;
    }
  );
}

async function disableNoFollow() {
  const activeTabId = await getActiveTagId();
  if (!activeTabId) {
    return;
  }

  chrome.tabs.sendMessage(activeTabId, {
    message: "___serp_ext_stop_script",
  });

  noFollowBtn.innerHTML = "Enable";
  noFollowBtn.onclick = enableNoFollow;
}
