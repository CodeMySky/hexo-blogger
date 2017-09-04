'use strict'

function ListGroup(jQueryElement) {
	this.parent = jQueryElement;
	this.activeItem = '';
	this.postList = [];
}

ListGroup.prototype._render = function() {
	var that = this;
	var selectedBtn = null;
	var postDOM = this.postList.map(function (post) {
		var btn = $('<a href="#" class="list-group-item list-group-item-action"></a>');
		btn.attr('href', '#' + post._id);
		btn.text(post.title);
		if (post._id === that.activeItem) {
			btn.addClass('active');
			selectedBtn = btn;
		}
		return btn;
	})
	this.parent.empty();
	this.parent.append(postDOM);
	if (selectedBtn && selectedBtn.length > 0) {
		selectedBtn[0].scrollIntoView();
	} else{
		console.log('this should not happen');
	}
	
};

ListGroup.prototype.updateAll = function(postList) {
	this.postList = postList;
	this._render();
};

ListGroup.prototype.setActive = function(id) {
	console.log('setActive' + id);
	this.activeItem = id;
	this._render();
};

ListGroup.prototype.createPost = function() {
	this.activeItem = '_new_post';
	this.postList.push({
		_id: '_new_post',
		title: 'Untitled'
	});
	this._render();
};

module.exports = ListGroup;