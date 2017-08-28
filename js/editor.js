'use strict'

function Editor() {
	this.currentPost = null;
}

Editor.prototype.setPost = function(post) {
	this.currentPost = post

	$('#title').val(post.title)
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
	$('.tagsinput').tagsinput('removeAll');
	post.tags.forEach(function (tag) {
		$('.tagsinput').tagsinput("add",tag.name)

	})
};

module.exports = Editor;