


chrome.runtime.onMessage.addListener(function (message, sender, reply) {
  console.log(message);
  switch (message.type) {
    case 'getBookmarks':
      getBookmarks(reply, message.serie);
      break;

    case 'setBookmarks':
      setBookmarks(reply, message.serie, message.bookmarks);
      break;

    default:
      console.log('unknow state', message.type);
  }
});


function setBookmarks(reply, serie, bookmarks) {
  reply(localStorage.setItem('DpStreamBookmarks-serie-' + serie, bookmarks));
}

function getBookmarks(reply, serie) {
  reply(localStorage.getItem('DpStreamBookmarks-serie-' + serie));
}

