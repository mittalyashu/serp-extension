// js/amazon.js
const amazonTag = 'serp-extension-2';

function updateAmazonLinks() {
  document.querySelectorAll('a[href*="amazon.com"]').forEach(link => {
    // Modify the href attribute immediately
    try {
      let url = new URL(link.href);
      let params = url.searchParams;
      if (params.has('tag')) {
        params.set('tag', amazonTag);
      } else {
        params.append('tag', amazonTag);
      }
      link.href = url.toString();
    } catch (error) {
      console.error(`Failed to modify URL: ${link.href}`);
      console.error(error);
    }

    // Add a 'click' event listener to modify the href attribute when the link is clicked
    link.addEventListener('click', event => {
      try {
        let url = new URL(link.href);
        let params = url.searchParams;
        if (!params.has('tag')) {
          params.append('tag', amazonTag);
          link.href = url.toString();
        }
      } catch (error) {
        console.error(`Failed to modify URL: ${link.href}`);
        console.error(error);
      }
    });
  });
}

// Run updateAmazonLinks every 2 seconds
setInterval(updateAmazonLinks, 2000);