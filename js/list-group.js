'use strict'

function ListGroup(jQueryElement) {
	this.parent = jQueryElement;
	this.activeItem = '';
	this.postList = [];
}

ListGroup.prototype._render = function() {
	var that = this;
	var postDOM = this.postList.map(function (post) {
		var btn = $('<a href="#" class="list-group-item list-group-item-action"></a>');
		btn.attr('href', '#' + post._id);
		btn.text(post.title);
		if (post._id === that.activeItem) {
			btn.addClass('active');
		}
		return btn;
	})
	this.parent.empty();
	this.parent.append(postDOM);
};

ListGroup.prototype.updateAll = function(postList) {
	this.postList = postList;
	this._render();
};

ListGroup.prototype.setActive = function(id) {
	this.activeItem = id;
	this._render();
};

module.exports = ListGroup;