/* 
* Copyright (c) 2008, 2009 Benoit Chesneau <benoitc@e-engura.com> 
*
* Permission to use, copy, modify, and distribute this software for any
* purpose with or without fee is hereby granted, provided that the above
* copyright notice and this permission notice appear in all copies.
*
* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

// Localize the display of <time> elements
function localizeDates() {
    var lastdate = '';
    var now = new Date();

    $('time').each(function() {
       var el = this;

        if (el.getAttribute('title') == "GMT") {
            var date = new Date(Date.parseRFC3339(el.getAttribute('datetime')));
            if (!date.getTime())
                return;
            diff = ((now.getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);
            if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
                return;
            var text = date.toLocaleString();
            var title = date.toLocaleString();
            
            if (day_diff == 0) {
                text = (diff < 60 && "Just Now" ||
                diff < 120 && "1 minute ago" ||
                diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
                diff < 7200 && "1 hour ago" ||
                diff < 86400 && Math.floor( diff / 3600 ) + " hours ago");
                title = date.toLocaleTimeString();
            } else {
                hours = date.getHours();
                minutes = date.getMinutes();
                hours = (hours < 10) && "0" + hours || hours;
                minutes = (minutes < 10) && "0" + minutes || minutes;
                text = (day_diff == 1 && "Yesterday at " +  hours + ":" + minutes ||
                        day_diff < 7 && day_diff + " days ago at "  +  hours + ":" + minutes ||    
                        el.textContent);
                title = date.toLocaleString();
            }
            el.setAttribute('title', title);
            el.textContent = text;
        }
    });

}

function escapeHTML(st) {                                       
  return(                                                                 
    st && st.replace(/&/g,'&amp;').                                         
      replace(/>/g,'&gt;').                                           
      replace(/</g,'&lt;').                                           
      replace(/"/g,'&quot;')                                         
  );                                                                     
};

// manage login. ask to register if needed
function Login(app, options) {
  var app = app;
  var options = options || {};
  var tips = $("#signup-tips");
  var userdb = $.couch.db("user");
  
  function updateTips(t) {
      tips.text(t).fadeIn(1500);
  }

  function checkLength(o, n, min, max) {
      if (o.val().length > max || o.val().length < min) {
          o.addClass('ui-state-error');
          updateTips("Length of " + n + " must be between " + min + " and " + max + ".");
          return false;
      } else {
          return true;
      }
  }

  function checkRegexp(o, regexp, n) {
      if (! (regexp.test(o.val()))) {
          o.addClass('ui-state-error');
          updateTips(n);
          return false;
      } else {
          return true;
      }
  }
  
  function login(username, password) {
    app.login({
      userdb: "user",
      username: username,
      password: password,
      success: function() {
        userdb.view("profile/profile", {
          key: username,
          success: function(json) {
            var profile = json.rows[0].value;
            $.cookies.set("NYMPHORMATION_ID", 
              profile['username'] + ";" + profile['gravatar'],
              "/");
            $("#login-popup").jqmHide();
            if (options.success) options.success();
          }
        });
        
      },
      error: function(s, e, r) {
        $("#login-popup").jqmHide();
        alert("An error occurred logging in: " + r);
      }
    });
  }
  
  $("#login-popup").jqmShow();
  $("a.close").click(function() {
    $("#login-popup").jqmHide();
    return false;
  });
 
  $("#flogin").submit(function(e) {
      e.preventDefault();
      login($("#user").val(), $("#passwd").val())
      return false;
  });
  
  $("#fsignup").submit(function(e) {
    e.preventDefault();
    var bValid = true;
    var username = $("#username"),
    email = $("#email"),
    password = $("#password"),
    allFields = $([]).add(username).add(email).add(password);
    
    
    allFields.removeClass('ui-state-error');

    bValid = bValid && checkLength(username, "username", 3, 16);
    bValid = bValid && checkLength(email, "email", 6, 80);
    bValid = bValid && checkLength(password, "password", 5, 16);
    
    bValid = bValid && checkRegexp(username, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter.");
		bValid = bValid && checkRegexp(email,/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,"eg. contact&nymphormation.com");
    bValid = bValid && checkRegexp(password,/^([0-9a-zA-Z])+$/,"Password field only allow : a-z 0-9");
    
    if (bValid) {
      userdb.view("profile/profile", {
        key: username.val(),
        success: function(json) {
          if (json.rows.length >0) {
            updateTips("Username already exist");
            
          } else {
            var salt = Math.uuid();
            var password_hash = b64_sha1(salt + hex_sha1(password.val()));

            var user = {
              username: username.val(),
              email: email.val(),
              password: password_hash,
              salt: salt,
              type: "user"
            };

            userdb.saveDoc(user, {
              success: function() {
                login(username.val(), password.val());
              }
            });
          }
        }
      });
    }
    return false;
  });
}

function parseUri(sourceUri){
   /* parseUri by Steven Levithan (http://badassery.blogspot.com) */
    var uriPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
    var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
    var uri = {};
    
    for(var i = 0; i < 10; i++){
        uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
    }
    
    // Always end directoryPath with a trailing backslash if a path was present in the source URI
    // Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key
    if(uri.directoryPath.length > 0){
        uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
    }
    
    return uri;
}



function updateChanges(app) {
  
  var app = app;
  
  var href = document.location.href;
  var uri = parseUri(document.location.href);
  var query = {};
  if (uri.query) {
    query_parts = uri.query.split("&");
    for (var i=0; i<query_parts.length; i++) {
      p = query_parts[i].split("=");
      query[p[0]] = p[1] || "";
    }
  }
  
  var next = query["next"] || false;
  startkey = ["link", {}];
  if (next)
    startkey = [next, {}]
  
  app.view("news",{
    reduce: false,
    startkey: startkey,
    endkey: [],
    descending: true,
    limit: 11,
    success: function(data) {
      var ids = [];
      for (var i=0; i<data.rows.length; i++) {
        ids.push(data.rows[i].value['_id']);
      }
      
      app.view("nbcomments", {
        keys: ids,
        group: true,
        success: function(json) {
          var nb_comments = {};
          for (var i=0; i<json.rows.length; i++) {
            row = json.rows[i];
            nb_comments[row.key] = row.value;
          }
          app.view("points", {
            keys: ids,
            group: true,
            success: function(json) {
              var points = {};
              for (var i=0; i<json.rows.length; i++)
                points[json.rows[i].key] = json.rows[i].value;
                
                
              $("#links").html(data.rows.map(function(row) {
                var news = row.value;

                if (news.url)
                  domain = parseUri(news.url).domain;
                else
                  domain = "";

                var item_url = news.url || app.showPath("item", news._id);

                var nb = nb_comments[news._id] || 0;
                var fcreated_at = new Date().setRFC3339(news.created_at).toLocaleString();
                return '<article class="item" id="'+news._id+'">'
                + '<h2><a href="'+ item_url + '">' + news.title + '</a> <span clas="host">'+domain+'</span></h2>'
                + '<p><span class="author">by <img src="http://www.gravatar.com/avatar/'
                + news.author.gravatar +'?s=22&amp;d=identicon" alt=""> <a href="'+ app.listPath('user', 'links')
                +'?key='+encodeURIComponent(JSON.stringify(news.author.username))+'">'
                + news.author.username + '</a></span> '
                + '<time title="GMT" datetime="' + news.created_at +'" class="caps">'+ fcreated_at + '</time>'
                + ' <span class="nbcomments"><a href="' + app.showPath("item", news._id) +'">'
                + nb + ' comments</a></span>'
                + ' <span class="nbvotes"><a href="' + app.showPath("item", news._id) +'">'
                +  points[news._id] + ' votes</a></span></p></article>';

              }).join(''));
              
              if (data.rows.length == 11) {
                var next = $('<div class="next"><a href="index.html?next='
                + data.rows[data.rows.length-1].value['_id'] +'">next</a></div>');
                $("#links").append(next);
              }
              
              localizeDates();
            }
          }) 
        }
      });  
    }
  });
}

function newestPage(app) {
  updateChanges(app);
  connectToChanges(app, function() {
    updateChanges(app);
  });
}


$.fn.noticeBox = function() {
    return this.each(function() {
        var s = this.style;
        s.left = (($(window).width() - $(this).width()) / 2) + "px";
        s.top = "40px";
        });
}

markdown_help = function(obj) {
    if ($(obj).next().is('.help')) {
        $(obj).next().remove();
        $(obj).html('help');
    } else {
        $(obj).html('hide help');
      
        
        $(obj).parent().append('<table class="help">'+
        '<tr><th>you type:</th><th>you see:</th></tr>'+
        '<tr><td>*italics*</td><td><em>italics</em></td></tr>'+
        '<tr><td>**bold**</td><td><b>bold</b></td></tr>'+
        '<tr><td>[friendurl!](http://friendurl.com)</td><td><a href="http://friendurl.com">friendurl!</a></td></tr>'+
        '<tr><td>* item 1<br/>* item 2<br />* item 3<br />'+
        '<td><ul><li>item 1</li><li>item 2</li><li>item 3</li></ul></td></tr>'+
        '<tr><td> > quoted text</td><td><bloquote>quoted text</bloquote></td></tr>'+
        '</table>');
    }
}

function formToDeepJSON(form, fields, doc) {
  var form = $(form);
  fields.forEach(function(field) {
    var val = form.find("[name="+field+"]").val()
    if (!val) return;
    var parts = field.split('-');
    var frontObj = doc, frontName = parts.shift();
    while (parts.length > 0) {
      frontObj[frontName] = frontObj[frontName] || {}
      frontObj = frontObj[frontName];
      frontName = parts.shift();
    }
    frontObj[frontName] = val;
  });
};

function submitComment(app, form, link_title) {
  var href = document.location;
  var app = app,
  link_title = link_title;
   
  var converter = new Showdown.converter;
  
  var localFormDoc = {
    type: "comment",
    link_title: link_title
  }

  formToDeepJSON(form, ["body", "linkid", "parentid"], localFormDoc);
  if (!localFormDoc.body) {
    alert("Comment required");
    return false;
  }
  
  localFormDoc.html = converter.makeHtml(escapeHTML(localFormDoc.body));
  
  localFormDoc.created_at = new Date().rfc3339();
  if (!localFormDoc.parentid) {
    localFormDoc.parentid = null;
  }
  var cookie = $.cookies.get("NYMPHORMATION_ID", "/").split(";");
  localFormDoc.author = { 
    username: cookie[0],
    gravatar: cookie[1]
  }
  app.db.openDoc(localFormDoc.parentid,{ 
    success: function(json) {
      if (json.path == undefined)
        path = [];
      else
        path = json.path;
      path.push(localFormDoc.parentid);
      localFormDoc.path = path;
      app.db.saveDoc(localFormDoc, {
        success: function(resp) {
          document.location = href;
        }
      });
    }
  });    
     
}

function fsubcomment(app, obj, link_title) {
  var obj = obj,
  link_title = link_title;
  app.isLogged(function() {
    var self = obj;
    var link_id = $(self).attr('id');
    var ids= link_id.split("_");
    cform = $('<form id="" class="cform"></form');
    $(cform).append('<input type="hidden" name="linkid" value="'+ ids[1] +'">'
    + '<input type="hidden" name="parentid" value="'+ ids[0] + '">'
    + '<textarea name="body" class="scomment"></textarea>');
    rsubmit=$('<div class="submit-row"></div>')
    bsubmit = $('<input type="submit" name="bsubmit" value="comment"'
    +'class="nf-button ui-state-default ui-corner-all">');
    bcancel = $('<input type="reset" name="bcancel" value="cancel"'
    +'class="nf-button ui-state-default ui-corner-all">');
    bcancel.click(function() {
        $(self).next().remove();
    });

    help = $('<a href="#" class="show-help">help</a>');
    help.click(function() {       
        markdown_help(this);
        return false;
    });

    $(rsubmit).append(bsubmit);
    $(rsubmit).append(bcancel);
    $(rsubmit).append(help);
    $(cform).append(rsubmit);
    $(cform).submit(function(e) {
        e.preventDefault();
        submitComment(app, this, link_title);
        return false;
    });
    cdiv = $('<div class="subcomment"></div>');
    $(cdiv).append(cform);

    $(self).parent().append(cdiv);
    
  }, function() {
    new Login(app, {
       success: function() {
         fsubcomment(app, obj);
       }
     });
  });
  
}


function doVote(app, obj, value) {
  var app=app,
  obj=obj,
  value=value,
  votes = {};

  var href = document.location;
  var id = $(obj).attr("id").substr(1);
  var cookie = $.cookies.get("NYMPHORMATION_ID", "/").split(";");
  var d = $('article#'+ id + " time").attr("datetime");
  
  var cookie_votes = $.cookies.get("NYMPHORTMATION_VOTES", "");
  if (cookie_votes)
    votes = JSON.parse(Base64.decode(cookie_votes));
            
  if (id in votes && value == votes[id]) return;
  
  var vote = {
    itemid: id,
    d: d,
    v: value,
    author: { 
      username: cookie[0],
      gravatar: cookie[1]
    },
    type: "vote",
  }
  
  app.db.saveDoc(vote, {
    success: function(doc) {
      votes[id] = value;
      $.cookies.set("NYMPHORTMATION_VOTES", Base64.encode(JSON.stringify(votes)), "/");
      if (value == 1) {
        $(obj).attr("src", "../../images/vote-arrow-up.png");
        $(obj).addClass("voted");
      } else {
        $(obj).attr("src", "../../images/vote-arrow-up-on.png");
        try {
           $(obj).removeClass("voted");
        } catch (e) {}
      }
    }
  });
}

function updateVotes(app, linkid) {
  app.view("points", {
    key: linkid,
    success: function(json) {
      $("span.vote-count").html(json.rows[0].value);
    }
  })
}

function itemPage(app, linkid, docid) {
  var app=app,
  linkid=linkid,
  docid=docid,
  votes = {};
  
  var cookie_votes = $.cookies.get("NYMPHORTMATION_VOTES", "");
  if (cookie_votes)
    votes = JSON.parse(Base64.decode(cookie_votes));
    
  if (linkid in votes) {
    var vote = $("#u"+linkid);
    vote.attr("src", "../../images/vote-arrow-up.png")
    vote.addClass("voted");
  }
    
  updateVotes(app, linkid);
  connectToChanges(app, function() {
    updateVotes(app, linkid);
  });
}


function updateComments(app, linkid, docid, link_title) {
  var docid = docid,
  linkid = linkid,
  app = app,
  link_title = link_title;
  
  function children(parentid, rows, comments, idx_comments) {
    for(var v=0; v < rows.length; v++) {
      value = rows[v].value;
      children = [];
      if (idx_comments[value['_id']] != undefined)
        children = idx_comments[value['_id']]['children'];
      value['children'] = children
      idx_comments[value._id] = value;

      if (value['parentid'] && value['parentid'] != parentid) {
        if (idx_comments[value['parentid']] == undefined) 
          idx_comments[value['parentid']] = {};
        if (idx_comments[value['parentid']]['children']  == undefined)
          idx_comments[value['parentid']]['children'] = [];
        idx_comments[value['parentid']]['children'].push(value._id);
      } else {
        comments.push(value)
      }
    }
  }
  
  
  function iter_comments(comments, idx, start) {
    if (start == undefined) {
       start = 0;
    }
    var c = comments[start];
    var thread = [];
    if (c['children'].length > 0) {
      for (var i=0; i < c.children.length; i++)
        thread.push(idx[c.children[i]]);
      iter_comments(thread, idx)
    }
    c['thread']  = thread;
    comments[start] = c;
    if (start < (comments.length - 1))
      iter_comments(comments, idx, start+1);
  }
  
  
  function dthread(thread, level) {
    if (level == undefined)
      level = 0;
    ret = "<ul>";
    for (var i=0; i<thread.length; i++) {
      var c = thread[i];
      var fcreated_at = new Date().setRFC3339(c.created_at).toLocaleString();
      ret += '<li class="comment" id="'+c._id + '">'
      + '<p class="meta">by <img src="http://www.gravatar.com/avatar/'
      + c.author.gravatar +'?s=22&amp;d=identicon" alt=""><a href="'
      + app.listPath('user', 'links')+'?key='+c.author.username+'">'
      + c.author.username + '</a> '
      + '<time title="GMT" datetime="' + c.created_at + '" class="caps">'
      + fcreated_at + '</time></p>'
      + '<div class="text">' + c.html + '</div>';
      
      ret += '<p class="bottom"><a href="'+ app.showPath("item", c._id) + '">link</a>'
      if (level < 5 )
        ret += ' | <a id="'+c._id + '_'+ linkid + '" href="#" class="reply">reply</a>';
      ret += '</p>'
      if (c['thread'])
        ret += dthread(c['thread'], level+1);
      ret +=  "</li>"
    }
    ret += "</ul>";
    return ret
  }
  
  app.view("comments_subtree",{
    startkey: [docid],
    endkey: [docid, {}],
    success: function(json) {
      if (json.rows.length>0) {
        var idx_comments = {};
        var comments = [];
        children(docid, json.rows, comments, idx_comments);
        iter_comments(comments, idx_comments);
        $("#comments").html(dthread(comments));
        localizeDates();
      }
      $(".reply").click(function(e) {
        if ($(this).next().is('.subcomment'))
            return false;    
        new fsubcomment(app, this, link_title);
        return false;
      });
      return true;
    }
  });
  
  
}

function connectToChanges(app, fun) {
  function resetHXR(x) {
    x.abort();
    connectToChanges(app, fun);    
  };
  app.db.info({success: function(db_info) {  
    var c_xhr = jQuery.ajaxSettings.xhr();
    c_xhr.open("GET", app.db.uri+"_changes?continuous=true&since="+db_info.update_seq, true);
    c_xhr.send("");
    c_xhr.onreadystatechange = fun;
    setTimeout(function() {
      resetHXR(c_xhr);      
    }, 1000 * 60);
  }});
};



function userNav(app) {
  var href = document.location;
  app.isLogged(function(data) {
     // get user profile
     $('.userprofile').autoRender({ userprofile: data.userCtx.name })
     $(".logged_in").show();
   }, function() {
     $(".not_logged_in").show();
     $("#login").click(function(e){
       e.preventDefault();
       Login(app, {
         success: function() {
           document.location = href;
         }
       });
       return false;
     });
   });
   
   $("#logout").click(function() {
     app.logout({
       userdb: "user",
       success: function() {
         try {
           $.cookies.remove("NYMPHORMATION_ID", "/");
         } catch (e) {}
         document.location = "/" + app.db.name + "/_design/" + app.name + "/index.html";
       }
     });
   });
   
   $("a.add").click(function() {
      var href = $(this).attr("href");
       app.isLogged(function() {
         document.location = href;
       }, function() {
         new Login(app, {
           success: function() {
             document.location = href;
           }
         });
       });
       return false;
    });
}

(function($) {
  $("#login-popup").jqm();

  $(".nf-button")
    .hover(
  		function() {
  			$(this).addClass('ui-state-hover');
  		},
  		function() {
  			$(this).removeClass('ui-state-hover');
  		}
  	)
  	.focus(function() {
  		$(this).removeClass('ui-state-focus');
  	})
  	.blur(function() {
  	  $(this).removeClass('ui-state-focus');
  	})
  	.mousedown(function(ev) {
			ev.stopPropagation();
		})
		.mouseout(function(ev) {
		  ev.stopPropagation();
		});
		

})(jQuery);