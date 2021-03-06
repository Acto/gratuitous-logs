// Generated by CoffeeScript 1.10.0
var convertMarkdownToHtml, dnd, initPreviewAndTag, insertAtCaret;

dnd = function(f) {
  if (f == null) {
    f = function() {};
  }
  return function(e) {
    e.stopPropagation();
    e.preventDefault();
    return f.apply($(this), [e, e.originalEvent.dataTransfer.files[0], e.originalEvent.dataTransfer.files]);
  };
};

convertMarkdownToHtml = function(url, waitTimer) {
  return $.ajax({
    async: true,
    type: "POST",
    url: url,
    dataType: "text",
    cache: false,
    data: {
      contents: $('#input-contents').val(),
      user_id: "test-user",
      user_pass: "test-pass"
    },
    context: this,
    success: function(data, status, xhr) {
      $("td#posts-preview").html(data);
      $("table#posts-table td#posts-textarea textarea").height($("td#posts-preview").height());
      window.isChange = false;
      return window.isWait = false;
    }
  }, clearInterval(waitTimer));
};

insertAtCaret = function(target, str) {
  var np, obj, p, r, s;
  obj = $(target);
  obj.focus();
  if (navigator.userAgent.match(/MSIE/)) {
    r = document.selection.createRange();
    r.text = str;
    return r.select();
  } else {
    s = obj.val();
    p = obj.get(0).selectionStart;
    np = p + str.length;
    obj.val(s.substr(0, p) + str + s.substr(p));
    return obj.get(0).setSelectionRange(np, np);
  }
};

initPreviewAndTag = function() {
  var i, len, tag;
  $('#article-tags').tagit({
    fieldName: 'post[tag_list]',
    singleField: true,
    availableTags: window.available_tag_list,
    placeholderText: 'TAGS separated by commas'
  });
  if (typeof tag_list !== "undefined" && tag_list !== null) {
    for (i = 0, len = tag_list.length; i < len; i++) {
      tag = tag_list[i];
      $('#article-tags').tagit('createTag', tag);
    }
  }
  $('#input-contents').on('keyup change', function() {
    var waitTimer;
    console.log("key up");
    if (window.isChange == null) {
      window.isChange = false;
    }
    if (window.isWait == null) {
      window.isWait = false;
    }
    if (window.isChange === false) {
      window.isChange = true;
      window.timeStart = new Date().getTime();
      return console.log("to TRUE");
    } else if (window.isChange === true && window.isWait === false) {
      window.isWait = true;
      waitTimer = 0;
      return waitTimer = setInterval(function() {
        return convertMarkdownToHtml("/posts/convert_mark2html", waitTimer);
      }, 3000);
    }
  }).keyup();
  return $('#input-contents').on('dragover', dnd(function() {
    return $('#input-contents').css('border', '4px green dashed');
  })).on('dragleave', dnd(function() {
    return $('#input-contents').css('border', '4px gray solid');
  })).on('drop', dnd(function(event) {
    var file, formData;
    file = event.originalEvent.dataTransfer.files[0];
    formData = new FormData();
    formData.append('file', file);
    return $.ajax({
      method: 'POST',
      url: "/posts/upload_image",
      dataType: "text",
      contentType: false,
      processData: false,
      data: formData,
      error: function(xhr, error) {
        console.log('アップデートに失敗しました');
        return console.log(error);
      },
      success: function(response) {
        var imageMarkdown, objImage;
        console.log(response);
        objImage = $.parseJSON(response);
        console.log(objImage['original_filename']);
        imageMarkdown = "![" + objImage['original_filename'] + "." + objImage['format_rev'] + "](" + objImage['secure_url'] + ")";
        insertAtCaret('#input-contents', imageMarkdown);
        convertMarkdownToHtml("/posts/convert_mark2html", 0);
        return console.log('アップロードに成功しました');
      },
      complete: function(xhr, status) {
        return $('#input-contents').css('border', '4px gray solid');
      }
    });
  }));
};

$(document).on('ready page:load', initPreviewAndTag);
