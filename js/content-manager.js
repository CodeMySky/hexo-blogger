'use strict'

const Hexo = require('hexo');

const fs =  require("fs-extra");
const path = require('path');
const util = require('util');
const slugify = require('slugify');

function ContentManager(folderPath, onCreatePost) {
    this.folderPath = folderPath;
    this.createHexo();
    this.onCreatePost = onCreatePost;
}

ContentManager.prototype.createHexo = function () {
    var that = this;
    this.hexo = new Hexo(this.folderPath, {});
    this.hexo.on('new', function(tempPost){
      console.log('new post');
      that.load(function (data) {
        var fullPost = data.filter(function (post) {
            return post.raw === tempPost.content;
        })

        // Make sure the output directory is there.
        fs.ensureDirSync(path.join(that.hexo.source_dir, 'images', fullPost[0].slug));
        that.onCreatePost(data, fullPost[0]);
      });
    });
}

ContentManager.prototype.load = function(callback) {
    // Initialize and Load Hexo Content
    var that = this;
    if (callback != null) {
        that.initCallback = callback;
    }
    that.createHexo();
    that.hexo.init().then(function () {
        that.hexo.load().then(function () {
            console.log('hexo load finished');
            var postQuery = that.hexo.locals.get('posts');
            that.postList = postQuery.data;
            that.postList.sort(function (post1, post2) {
                return post1.canonical_path.localeCompare(post2.canonical_path);
            })
            that.initCallback(that.postList );
        })
    })
};

ContentManager.prototype.filterByID = function(id) {
    return this.hexo.model('Post').findById(id)
};

ContentManager.prototype.createPost = function(createdPost) {
    var slug = slugify(createdPost.title).toLowerCase();
    this.hexo.post.create({
        title: slug,
        slug: slug
    }, false);
};

ContentManager.prototype.updatePost = function(updatedPost) {
    var currentPost = updatedPost.post;
    var that = this;
    that.isWriting = false;
    if (currentPost != null & !this.isWriting) {
        that.isWriting = true;
        currentPost.title = updatedPost.title;
        currentPost.setTags(updatedPost.tags.split(','));
    
        currentPost.thumbnail = updatedPost.thumbnail;
        currentPost.save();

        var fullContent =
util.format(`---
title: '%s'
date: %s
tags: [%s]
thumbnail: %s
---
%s`, updatedPost.title, currentPost.date.valueOf(), updatedPost.tags, updatedPost.thumbnail, updatedPost.content);
        fs.writeFile(path.join(this.folderPath, 'source', currentPost.source),
            fullContent, 'utf-8', function (err) {
                that.isWriting = false;
            });
    }
    
};

ContentManager.prototype.publish = function(callback) {
    var that = this;
    if (that.hexo.config.deploy.repo.includes('http')) {
        return callback('Please change git repo to ssh url, and reload.');
    }
    console.log('Publishing');
    that.hexo.call('generate', {'d':true}).then(function(){
      that.hexo.exit();
      return callback(null);
    }).catch(function(err){
        console.log(err);
      that.hexo.exit(err);
      return callback(err);
    });
};

module.exports = ContentManager;