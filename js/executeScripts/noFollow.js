var ID = "___serp_ext_nofollow"

function addStyles() {
  const css = document.createElement("style");
  css.id = ID;

  // To keep the styles update-to-date
  let noFollowStyleTag = document.getElementById(ID);
  if (noFollowStyleTag) {
    noFollowStyleTag.parentNode.removeChild(noFollowStyleTag);
  }

  css.innerHTML = "a[rel~='nofollow'] {outline: .14em dotted red !important;outline-offset: .2em;}a[rel~='nofollow'] img {outline: 2px dotted red !important;outline-offset: .2em;}";

  var head = document.head;
  head.appendChild(css);
}

addStyles();

function removeStyles() {
  let noFollowStyleTag = document.getElementById(ID);
  if (noFollowStyleTag) {
    noFollowStyleTag.parentNode.removeChild(noFollowStyleTag);
  }
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "___serp_ext_stop_script") {
    removeStyles();
  }
});
