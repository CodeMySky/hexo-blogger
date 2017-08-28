// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer;

$('#set-path').click(function () {
  ipc.send('open-file-dialog');
});

const Store = require('electron-store');
const store = new Store();
const path = require('path');

const ListGroup = require('./js/list-group.js');
var listGroup = new ListGroup($('.blog-list'));

const ContentManager = require('./js/content-manager.js');

var hexoPath = store.get('hexo-path');

var contentManager = new ContentManager(hexoPath);
contentManager.load(function (data) {
	listGroup.updateAll(data);
})

const Editor = require('./js/editor.js');
var editor = new Editor()

window.onhashchange = function (hashchange ) {
	var id = window.location.hash.substr(1);
	var post = contentManager.filterByID(id);
	editor.setPost(post);
	listGroup.setActive(id)
}