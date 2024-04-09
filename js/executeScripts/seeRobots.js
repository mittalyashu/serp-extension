var robotsInfo = { index: true, follow: true };

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "___serp_ext_start_robots_tags") {
    let metatag = "";
    let metas = document.getElementsByTagName("meta");

    for (let x = 0, y = metas.length; x < y; x++) {
      if (metas[x].name.toLowerCase() == "robots") {
        let content = metas[x].getAttribute("content").toString();
        metatag = metatag + " " + content.toLowerCase();
      }
    }

    if (metatag === "") {
      robotsInfo.index = true;
      robotsInfo.follow = true;
    } else {
      robotsInfo.index =
        metatag.indexOf("noindex") != -1 || metatag == "noindex" ? false : true;
      robotsInfo.follow =
        metatag.indexOf("nofollow") != -1 || metatag == "nofollow"
          ? false
          : true;
    }

    sendResponse(robotsInfo);
  }
});
