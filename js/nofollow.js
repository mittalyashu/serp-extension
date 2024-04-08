function getActiveTag() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      if (activeTab) {
        resolve(activeTab);
      } else {
        reject(new Error("No active tab found."));
      }
    });
  });
}

const noFollowBtn = document.getElementById("noFollowBtn");
noFollowBtn.onclick = disableNoFollow;

async function enableNoFollow() {
  const activeTab = await getActiveTag();
  if (!activeTab?.id) {
    return;
  }

  chrome.scripting.executeScript(
    {
      target: { tabId: activeTab.id },
      files: ["js/executeScripts/noFollow.js"],
    },
    function () {
      noFollowBtn.innerHTML = "Disable";
      noFollowBtn.onclick = disableNoFollow;

      const url = new URL(activeTab.url);
      chrome.storage.local.remove(
        `___serp_ext_disable-noFollow-${url.host}`,
        function () {}
      );
    }
  );
}

async function disableNoFollow() {
  const activeTab = await getActiveTag();
  if (!activeTab?.id) {
    return;
  }

  chrome.tabs.sendMessage(activeTab.id, {
    message: "___serp_ext_stop_script",
  });

  const url = new URL(activeTab.url);
  chrome.storage.local.set(
    { [`___serp_ext_disable-noFollow-${url.host}`]: true },
    function () {
      console.log("Feature disable: [No follow]: " + url.host);
    }
  );

  noFollowBtn.innerHTML = "Enable";
  noFollowBtn.onclick = enableNoFollow;
}

async function checkState() {
  const activeTab = await getActiveTag();
  if (!activeTab?.id) {
    return;
  }

  const url = new URL(activeTab.url);
  const key = `___serp_ext_disable-noFollow-${url.host}`;
  chrome.storage.local.get([key], function (result) {
    if (result.hasOwnProperty(key)) {
      noFollowBtn.innerHTML = "Enable";
      noFollowBtn.onclick = enableNoFollow;
    } else {
      noFollowBtn.innerHTML = "Disable";
      noFollowBtn.onclick = disableNoFollow;
    }
  });
}


checkState()
