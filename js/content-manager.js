'use strict'

const Hexo = require('hexo');

function ContentManager(folder_path) {
	this.hexo = new Hexo(folder_path, {});
}

ContentManager.prototype.load = function(callback) {
	// Initialize and Load Hexo Content
	var that = this;
	that.hexo.init().then(function () {
		console.log('hexo finished')
		that.hexo.load().then(function () {
			var postQuery = that.hexo.locals.get('posts');
			that.postList = postQuery.data;
			callback(that.postList );
		})
	})
};

ContentManager.prototype.filterByID = function(id) {
	var content = this.postList.filter(function (post) {
		return post._id === id;
	});

	if (content) {
		return content[0];
	} else {
		return null;
	}
};

module.exports = ContentManager;