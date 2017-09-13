'use strict'

function Editor(onChange, onCreate) {
    this.currentPost = null;
    this.titleInput = $('.title-input');
    this.tagsInput = $('.tags-input');
    this.onChange = onChange;
    this.onCreate = onCreate;

    // this.titleInput.change(this.change);
    // this.tagsInput.change(this.hange);

    var that = this;

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
            var previewContent

            if (e.isDirty()) {
              var originalContent = e.getContent()

              previewContent = "Prepended text here..."
                     + "\n"
                     + originalContent
                     + "\n"
                     +"Apended text here..."
            } else {
              previewContent = "Default content"
            }

            return previewContent
          },
          onSave: function(e) {
            console.log("Saving '"+e.getContent()+"'...")
          },
          onChange: function(e){
            console.log("Changed!");
            that.change();
          },
          onFocus: function(e) {
            console.log("Focus triggered!")
          },
          onBlur: function(e) {
            console.log("Blur triggered!")
          }
        })
}

Editor.prototype.change = function() {
    var that = this;
    this.onChange({
                'post': that.currentPost,
                'title': that.titleInput.val(),
                'tags': that.tagsInput.val(),
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
};

Editor.prototype.setPost = function(post) {
    this.currentPost = post

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
    })
};

module.exports = Editor;