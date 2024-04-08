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

const seeRobotsBtn = document.getElementById("seeRobotsBtn");
seeRobotsBtn.onclick = startRobotsFunc;

const seeRobotsData = document.getElementsByClassName("seeRobots-data");
const indexText = document.getElementById("seeRobotsIndex");
const robotsText = document.getElementById("seeRobotsFollow");

async function startRobotsFunc() {
  const activeTab = await getActiveTag();
  if (!activeTab?.id) {
    return;
  }

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      message: "___serp_ext_start_robots_tags",
    },
    function (response) {
      if (response.index) {
        indexText.setAttribute('class', 'green')
      } else {
        indexText.setAttribute('class', 'red')
      }

      if (response.follow) {
        robotsText.setAttribute('class', 'green')
      } else {
        robotsText.setAttribute('class', 'red')
      }

      if (seeRobotsData && seeRobotsData[0]) {
        seeRobotsData[0].removeAttribute('style');
      }

      if (seeRobotsBtn) {
        seeRobotsBtn.setAttribute('style', 'display: none');
      }
    }
  );
}