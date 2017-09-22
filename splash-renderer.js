const {dialog} = require('electron').remote;
const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const path = require('path');
const cmd = require('node-cmd');

$('.hexo-file-input').click(function () {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files) {
      $('.hexo-path').val(files[0]);
      $('.hexo-path').change();
    }
  })
});

$('.hexo-path').change(function () {
  var hexoPath = $(this).val()
  console.debug('Hexo folder set to '+ hexoPath);
  fs.access(path.join(hexoPath,'source'), function (err) {
    if (err) {
      $('.go-btn').prop('disabled', true)
                .addClass('disabled');
      $('.hexo-success').hide();
      $('.hexo-error').show();
    } else {
      store.set('hexo-path', hexoPath);
      $('.go-btn').prop('disabled', false)
                .removeClass('disabled');
      $('.hexo-error').hide();
      $('.hexo-success').show();
    }
  })
})

$('.go-btn').click(function () {
  var hexoPath = store.get('hexo-path');
  console.log('cd '+hexoPath +' && npm install');
  NProgress.start();
  cmd.get('cd '+hexoPath+' && npm install', function (err) {
    NProgress.done();
    if (err) {
      bootbox.alert(err);
    } else {
      window.location = 'editor.html'
    }
  });
  
})



$(document).ready(function () {
  var hexoPath = store.get('hexo-path');
  if (hexoPath) {
    $('.hexo-path').val(hexoPath).change();
  }
})