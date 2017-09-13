'use strict'
'use strict';
const Store = require('electron-store');
const store = new Store();
const hexoPath = store.get('hexo-path');

function Editor(onChange, onCreate) {
    this.currentPost = null;
    this.titleInput = $('.title-input');
    this.tagsInput = $('.tags-input');
    this.thumbnailInput = $('.thumbnail-input');
    this.refreshing = false;
    this.onChange = onChange;
    this.onCreate = onCreate;
    var that = this;

    this.titleInput.change(function(){
      that.change()
    });
    this.tagsInput.change(function (){
      that.change();
    });
    this.thumbnailInput.change(function(){
      that.change();
    });


    

    this.titleInput.blur(function () {
      if (that.currentPost === null) {
        that.onCreate({
          title: that.titleInput.val()
        })
      }
    })

    $("#target-editor").markdown({
          savable:false,
          onShow: function(e){
            console.log('shown')
            that.mdEditor = e;
          },
          onPreview: function(e) {
            var originalContent = e.getContent()
            var previewContent = originalContent.replace(
              /(!\[.*?\]\()(.+?)(\))/g, function (whole, a, b, c) {
                return a + hexoPath + '/source' + b + c;
              }
            );
            return e.parseContent(previewContent);
          },
          onChange: function(e){
            console.log("Changed!");
            that.change();
          }
        })
}

Editor.prototype.change = function() {
    var that = this;
    if (this.refreshing) {
      return;
    }
    this.onChange({
                'post': that.currentPost,
                'title': that.titleInput.val(),
                'tags': that.tagsInput.val(),
                'thumbnail': that.thumbnailInput.val(),
                'content': that.mdEditor.getContent()
            });
};

Editor.prototype.createPost = function() {
  // Save previous post
  this.change();
  this.currentPost = null;
  $('.title-input').val('')
  $('.tags-input').tagsinput('removeAll');
  $('.md-input').val('');
  $('.thumbnailInput').val('');
};

Editor.prototype.setPost = function(post) {
    this.refreshing = true;
    this.currentPost = post;

    $('.title-input').val(post.title)
    var rawContent = post.raw
    var rawContentByLine = rawContent.split('\n')
    var startCount = 0
    var dashCount = 0
    while (dashCount < 2) {
        if (rawContentByLine[startCount] === '---') {
            dashCount ++;
        }
        startCount++;
    }
    rawContentByLine = rawContentByLine.slice(startCount);
    $('.md-input').val(rawContentByLine.join('\n'))
    $('.tags-input').tagsinput('removeAll');
    post.tags.forEach(function (tag) {
        $('.tags-input').tagsinput("add",tag.name);
    });
    this.thumbnailInput.val(post.thumbnail);
    this.refreshing = false;
};

module.exports = Editor;