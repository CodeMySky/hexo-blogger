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

NProgress.start();

var contentManager = new ContentManager(hexoPath, function (data, newPost) {
    // onCreatePost
    console.log('data loaded, new post');
    listGroup.updateAll(data);
    listGroup.setActive(newPost._id);
    editor.setPost(newPost);
    window.location.hash = '#' + newPost._id;
  });



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
    editor.change();
    editor.setPost(post);
    listGroup.setActive(id)
}


$('.publish-btn').click(function () {
  NProgress.start();
  contentManager.publish(function (err) {
    NProgress.done();
    if (err) {
      bootbox.alert(err);
    } else {
      bootbox.alert('Deployed Successfully!');
    }
  });
});

$('.new-blog-btn').click(function () {
  editor.createPost();
  listGroup.createPost();
})

$(document).ready(function () {
    contentManager.load(function (data) {
      console.log('data loaded, updating');
      listGroup.updateAll(data);
      if (data.length > 0) {
        listGroup.setActive(data[0]._id);
        editor.setPost(data[0])
      }
      NProgress.done()
    });
})