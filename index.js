
/*  INIT  */
window.bookmarksList = [];

injectCss('style.css');

initModale();
addBookmarkLink();
getBookmarksFor(extractSerie(window.location.pathname), function (bookmarks) {
  if (bookmarks) {
    window.bookmarksList = bookmarks;
  }
  showBookmarks(window.bookmarksList);
});


/*  name: getLinks
 *  desc: get all episode links on the current page
 */
function getLinks() {
  var regexpId = new RegExp(/[\d]+-[\d]+-[A-Z]+/),
      allElem = document.getElementsByClassName('b');
      filtered = [];

  for (var i = 0; i < allElem.length; i++) {
    if (allElem[i].id && regexpId.test(allElem[i].id)) {
      filtered.push(allElem[i]);
    }
  }
  return filtered;
}

/*  name: addBookmarkLink
 *  desc: attach onmouseover function to after be able set modale position
 */
function addBookmarkLink() {
  var regexId = new RegExp(/[\d]+-[\d]+-[A-Z]+/),
      links = getLinks(),
      ul = document.getElementById('divliste');

  for (var i = 0, len = links.length; i < len; i++) {
    var id = links[i].id;

    links[i].onmouseover = (function (element) {
      return function () {
        console.log('plop');
        setModale(element);
      };

    })(links[i]);
  }
}

function hideModale() {
  var modale = document.getElementById('bookmark-modale');

  modale.style.display = 'none';
}

/*  name: setModale
 *  desc: set position and visibility of the modale
 */
function setModale(element) {
  var modale = document.getElementById('bookmark-modale'),
      add = document.getElementById('bookmark-modale-add'),
      del = document.getElementById('bookmark-modale-del'),
      elementSize = '140';
      offset = getOffset(element);

  modale.style.display = 'block';
  modale.style.left = (offset.left - elementSize - 10) + 'px';
  modale.style.top = offset.top + 'px';
  modale.title = element.id;

  if (window.bookmarksList.indexOf(element.id) === -1) {
    add.style.display = 'block';
    del.style.display = 'none';
  } else {
    add.style.display = 'none';
    del.style.display = 'block';
  }
}

/*  name: getOffset
 *  desc: Get position of the given element
 */
function getOffset(el) {
    var _x = 0;
    var _y = 0;

    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft;
        _y += el.offsetTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

/*  name: initModale
 *  desc: init modale element
 */
function initModale() {
  var div = document.createElement('div'),
      aAdd = document.createElement('a'),
      aDel = document.createElement('a'),
      linkTextAdd = document.createTextNode('Add bookmark'),
      linkTextDel = document.createTextNode('Del bookmark'),
      spanClose = document.createElement('span'),
      linkTextClose = document.createTextNode('x');


  aAdd.appendChild(linkTextAdd);
  aAdd.onclick = function (event) {
    addBookmark(div.title);
    event.preventDefault()
  };
  aAdd.style.display = 'none';
  aAdd.id = 'bookmark-modale-add';

  aDel.appendChild(linkTextDel);
  aDel.onclick = function (event) {
    removeBookmark(div.title);
    event.preventDefault()
  };
  aDel.style.display = 'none';
  aDel.id = 'bookmark-modale-del';

  spanClose.appendChild(linkTextClose);
  spanClose.id = 'bookmark-modale-close';
  spanClose.onclick = function () {
    closeModale();
  };

  div.style.display = 'none';
  div.id = 'bookmark-modale';
  div.appendChild(aAdd);
  div.appendChild(aDel);
  div.appendChild(spanClose);

  document.body.appendChild(div);
}

function closeModale() {
  var modale = document.getElementById('bookmark-modale');

  modale.style.display = 'none';
}

/*  name: addBookmark
 *  desc: add a link to the bookmark list
 */
function addBookmark(id) {
  var serie = extractSerie(window.location.pathname);

  window.bookmarksList.push(id);
  showBookmarks(window.bookmarksList);
  setBookmarksFor(serie, window.bookmarksList, function () {
    console.log('Added ', id, 'to bookmarked episode');
  });
}


/*  name: removeBookmark
 *  desc: Remove a link from bookmark list
 */
function removeBookmark(id) {
  var serie = extractSerie(window.location.pathname);

  window.bookmarksList.splice(window.bookmarksList.indexOf(id), 1);
  showBookmarks(window.bookmarksList);
  setBookmarksFor(serie, window.bookmarksList, function () {
    console.log('Removed ', id, 'to bookmarked episode');
  });
}

/*  name: showBookmarks
 *  desc: Add css class to set a link to a bookmarked state.
 */
function showBookmarks(bookmarks) {
  var links = getLinks();

  for (var i = 0; i < links.length; i++) {
    links[i].classList.remove('bookmarked');
  }


  bookmarks.forEach(function (bookmark) {
    element = document.getElementById(bookmark);
    element.classList.add('bookmarked');
  });
}

/*  name: injectCss
 *  desc: Inject a Css file at the end of the Head tag
 */
function injectCss(file) {
  var link = document.createElement('link');

  link.href = chrome.extension.getURL(file);
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
}

/*  name: extractSerie
 *  desc: extract the serie Id from its pathname;
 */

function extractSerie(pathname) {
  var regex = /\/serie-([\d]+)/,
      id = pathname.match(regex);

  if (!id) { return null; }

  return id[1];
}

/*  name: getBookmarksFor
 *  desc: Ask to background.js bookmarks for id
 */

function getBookmarksFor(id, callback) {
  chrome.runtime.sendMessage({
    type:'getBookmarks',
    serie: id
  }, function(result) {
    callback(JSON.parse(result));
  });
}

/*  name: setBookmarksFor
 *  desc: Ask to background.js to add bookmarks for id
 */

function setBookmarksFor(id, bookmarks, callback) {
  chrome.runtime.sendMessage({
    type:'setBookmarks',
    serie: id,
    bookmarks: JSON.stringify(bookmarks)
  }, function() {
    callback();
  });
}
