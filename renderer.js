// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer;

const Store = require('electron-store');
const store = new Store();
const path = require('path');

const ListGroup = require('./js/list-group.js');
var listGroup = new ListGroup($('.blog-list'));

const ContentManager = require('./js/content-manager.js');

var hexoPath = store.get('hexo-path');
const cmd = require('node-cmd')

if (hexoPath === null) {
  return $('.set-path-btn').click();
} else {
  console.log('cd '+hexoPath +' && npm install');
  cmd.get('cd '+hexoPath+' && npm install', function () {
    init();
  });
}

var contentManager = new ContentManager(hexoPath, function (data, newPost) {
  // onCreatePost
   console.log('data loaded, new post');

    listGroup.updateAll(data);
    listGroup.setActive(newPost._id);
    editor.setPost(newPost);
    window.location.hash = '#' + newPost._id;
  });

function init() {
  // body...
  contentManager.load(function (data) {
    console.log('data loaded, updating');
    listGroup.updateAll(data);
    if (data.length > 0) {
      listGroup.setActive(data[0]._id);
      editor.setPost(data[0])
    }
  });
}


const Editor = require('./js/editor.js');
var editor = new Editor(function (updatedPost) {
    contentManager.updatePost(updatedPost);
}, function (createdPost) {
  contentManager.createPost(createdPost);
})

window.onhashchange = function (hashchange ) {
  if (window.location.hash.length != 26){
    console.log('Illegal Hash' + window.location.hash);
    return;
  }
    var id = window.location.hash.substr(1);
    var post = contentManager.filterByID(id);
    editor.setPost(post);
    listGroup.setActive(id)
}


ipc.on('update-hexo-path', function (event, path) {
  console.log('clicked')
  store.set('hexo-path', path);
})


$('.set-path-btn').click(function () {
  alert('Please restart Hexo Blogger after set path');
  ipc.send('open-file-dialog');
});

$('.publish-btn').click(function () {
  contentManager.publish();
});

$('.new-blog-btn').click(function () {
  editor.createPost();
  listGroup.createPost();
})
