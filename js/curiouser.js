
$(document).ready( function() {
	$('.listit-getter').submit( function(event){
		// zero out previous results
		$('.lala .flickrs > h2').remove();
		$('.lala .flickrs .polaroids').html('');
		$('.lala .youtubes').html('');
		$('.lala .google-pluses > h2').remove();
		$('.lala .google-pluses div').html('');
		// get the tags the user entered
		var tag = $(this).find("input[name='tag']").val();
		var checked = $(".listit-getter input[name='youtube']").prop('checked');
		if (checked) {
			getYoutubes(tag);
		}
		checked = $(".listit-getter input[name='flickr']").prop('checked');
		if (checked) {
			getFlickrs(tag);
		}
		checked = $(".listit-getter input[name='google-plus']").prop('checked');
		if (checked) {
			getGooglePluses(tag);
		}
	});

	$(".listit-getter input[name='tag']").on("keypress", function(e) {
        if (e.keyCode == 13) {
            $(".listit-getter").submit();
            return false; // prevent the button click from happening
        }
	});
	$(".listit-getter input[name='youtube']").click(function(){
		var checked = $(this).prop('checked');
		var tag = $(".listit-getter").find("input[name='tag']").val();
		if (checked == true) {
			getYoutubes(tag);
		} else {
			$('.lala .youtubes').html('');
		}
    });
    $(".listit-getter input[name='flickr']").click(function(){
		var checked = $(this).prop('checked');
		var tag = $(".listit-getter").find("input[name='tag']").val();
		if (checked == true) {
			getFlickrs(tag);
		} else {
			$('.lala .flickrs .polaroids').html('');
			$('.lala .flickrs > h2').hide();
		}
    });
      $(".listit-getter input[name='google-plus']").click(function(){
		var checked = $(this).prop('checked');
		var tag = $(".listit-getter").find("input[name='tag']").val();
		if (checked == true) {
			getGooglePluses(tag);
		} else {
			$('.lala .google-pluses div').html('');
			$('.lala .google-pluses > h2').hide();
		}
    });

     $("#logo").hover(function() {
     	$(".circleSm").fadeToggle(5000,"swing");
     	$(".circleMed").fadeToggle(5000,"swing");
     });

});	
// Display an object's properties (non-inherited) and associated values
function showProps(obj, objName) {
  var result = "";
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
        result = result + objName + "." + property + " = " + obj[property] + "<br>";
    }
    result=result+"<br>";
  }
  return result;
}
//YouTube Display
var youtube = function (vid){
	var youtube = $('.templates .youtube ').clone();
	var caption= '<figcaption>' + vid.snippet.title.substring(0, 55) + '</figcaption>';
	var img = youtube.find('figure');
	if (typeof(vid.id.videoId) == "undefined") {
		return vid.id.videoId;
	}
	img.append('<a href="http://www.youtube.com/watch?v=' + vid.id.videoId + '" target=_blank><img src="' + vid.snippet.thumbnails.medium.url + '" alt="' +vid.snippet.title.substring(0, 55)+'"/></a>'+caption);
	//$(".test").append(showProps(vid, "YouTube"));
	return youtube;
};
//Youtube API 
var getYoutubes = function(search) {
	$('.lala .youtubes').append("<h2>YouTube</h2>");
	// set key for Google API
	gapi.client.setApiKey('AIzaSyCrDYW6fz-QkEtSC08dnkoC7axlLdcuRSA');
	var what = {part: "snippet", q: search, maxResults: 50, order: "viewCount"};
	var result = gapi.client.request({
		path: '/youtube/v3/search',
		params: what
	});

	result.execute(function (response){
		$.each(response.items, function (i, items){
			var video = youtube(items);
			if (video) {
				$('.youtubes').append(video);
				$('.youtubes').fadeIn(1000);
			}
		});
		$('.youtubes').append("<br class='clearfix'>");
	});
};
//GOOGLE PLUS 
var googlePlus = function (person){
	var p = $('.templates .google-plus ').clone();
	//Quick Variables
	var name = p.find('.p-name');
	var title = person.title;
	if (title) {
		title = "<h2>"+title+"</h2>";
	} else {
		title="";
	}
	var content = p.find('.p-content');
	var attachments = person.object.attachments;
	name.find('.profile-link').attr('href', person.actor.url);
	name.find('.profile-link').attr('title',person.actor.displayName);
	name.find('img').attr('src',person.actor.image.url);
	name.find('img').attr('alt',person.actor.displayName);
	name.find('.title').text(person.actor.displayName);
	// Pictures?
	var descImg ="";
	if (attachments && attachments[0].image && attachments[0].image.url) {
		descImg = '<img src="' + attachments[0].image.url +'"/>';
	}
	var elem = person.object.content;
	var textParts = elem.split(".");
	var first = textParts.shift() + ".";
	var readMore = '<p><a href="' + person.actor.url + '" class="readMore" target=_blank>Read more</a></p>';
	content.html(title+first + readMore + descImg);
	return p;
};
//GOOGLE PLUS API CALLBACK
var getGooglePluses = function (search) {
	//Sets API key for Google API
	$("<h2>Google Plus</h2>").insertBefore('.google-pluses .col-one');
	gapi.client.setApiKey('AIzaSyCrDYW6fz-QkEtSC08dnkoC7axlLdcuRSA');
	//Parameters for the YouTube.Search method
	var what = {query: search, maxResults: 20};
	var result = gapi.client.request({
		path: 'plus/v1/activities',
		params: what,
		method: 'GET',
	});
	result.execute(function (response){
		var half = Math.round(response.items.length/2);
		$.each(response.items, function (i, items){
			var activities = googlePlus(items);
			if (i < half) {
				$('.google-pluses .col-one').append(activities);
			} else {
				$('.google-pluses .col-two').append(activities);
			}
		});
		if (response.items.length === undefined) {
			$('.google-pluses .col-one').html('Nothing was found.');
		}
		$('.google-pluses').append("<br class='clearfix'>");
	});
};
// Flickr 
var flickr = function (flickpic,i){
	var flickr = $('.templates .flickr ').clone();
	flickr.attr("id","flick"+i);
	var title = flickpic.title;
	if (flickpic.title.indexOf(".jpg") >=0 || flickpic.title.indexOf(".png") >=0) {
		title = "untitled ";
	}
	var caption= '<figcaption>' + title + '</figcaption>';
	var img = flickr.find('figure');
	img.append('<a target=_blank href="'+ flickpic.link +'" ><img  id="flickimg' +i+ '" class="flickr_img" src="' + flickpic.media.m + '"/></a>' + caption);
	return flickr;
};
var polaroid = function (flickpic,i){
	var flickr = $('.templates .flickr li').clone();
	flickr.attr("id","flick"+i);
	var title = flickpic.title;
	if (flickpic.title.indexOf(".jpg") >=0 || flickpic.title.indexOf(".png") >=0) {
		title = "untitled ";
	}
	var img = '<img  id="flickimg' +i+ '" class="flickr_img" src="' + flickpic.media.m + '" alt="'+ title+'" />';
	var caption = '<div class="caption">'+ title+'</div>';
	flickr.html('<a target=_blank href="'+ flickpic.link +'" title="'+ title+'" >'+img+caption+'</a>');	
	//$(".test").append(showProps(flickr, "Flicker"));
	return flickr;
}
// Flickr Search
var getFlickrs = function (search) {
	$("<h2>Flickr</h2>").insertBefore('.flickrs .polaroids');
	var flickrAPI = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';
	var result = $.getJSON( flickrAPI ,
        {
          tags: search,
          tagmode: "any",
          format: "json"
    }).done(function (img) {
		$.each(img.items, function (i, picture){
			var flickpic = polaroid(picture,i);
			$('.flickrs .polaroids').append(flickpic);
			$('.flickrs').fadeIn(1000);
			if ( i == 50 ) {
				return false;
			}
		});
		$('.flickrs .polaroids').append("<br class='clearfix'>");
		 setTimeout(function(){ 
		 	var oFlicks = $(".flickr");
			oFlicks.each(function (j){
				var picId = "flickimg"+j;
				var lastImg= document.getElementById(picId);
				var jLastImg = $(this).find("img");
				if (lastImg) {
					if (lastImg.naturalWidth < lastImg.naturalHeight || jLastImg.width() <  jLastImg.height()) {
						var lastFlick = $("#flick"+j);
						//alert("skinny");
						lastFlick.addClass("portrait");
						lastFlick.css("left-margin","30px");
					}
				}
				if ( j == 50 ) {
					return false;
				}
			});
		}, 500); 
		return false;
	});
};
// Turns error string into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};
