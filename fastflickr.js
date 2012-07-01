$ = jQuery;

var ssdLight = {
	titleDisplay : true,
	arrayRel : [],
	currentIndex : 0,
	imgHeight : 0,
	imgWidth : 0,
	imgPaddingHor : 20,
	imgPaddingVer : 20,
	toolsHeight : 25,
	attrRel : null,
	attrTitle : null,
	attrImg : null,
	containerPreload : '<div class="preloader"></div>',
	containerOverlay : '<div id="overlay"></div><div class="preloader"></div>',
	containerLightBox : '<div id="lightbox"><div id="lightbox-wrapper"><div id="lightbox-content"></div><div id="lightbox-tools"><span id="lightbox-close">Close</span><span id="lightbox-prev" class="paging">Previous</span><span id="lightbox-prev-inactive" class="paging">Previous</span><span id="lightbox-next" class="paging">Next</span><span id="lightbox-next-inactive" class="paging">Next</span></div></div></div>',
	run : function(obj) {
		
		$('body').append(ssdLight.containerOverlay);
		
		ssdLight.liveClose();
		
		ssdLight.attrRel = obj.attr('rel');
		ssdLight.attrTitle = obj.attr('title');
		ssdLight.attrImg = obj.attr('href');
		
		var imgObject = new Image();
		
		imgObject.onload = function() {
			
			$('.preloader').fadeOut(200, function() {
				$(this).remove();
			});
			
			ssdLight.imgHeight = imgObject.height;
			ssdLight.imgWidth = imgObject.width;
			
			var imgTag = '<img src="' + ssdLight.attrImg + '" id="currentImage" ';
			imgTag += 'alt="' + ssdLight.attrTitle + '" ';
			imgTag += 'width="' + ssdLight.imgWidth + '" ';
			imgTag += 'height="' + ssdLight.imgHeight + '" />';
			
			$('body').append(ssdLight.containerLightBox);
			
			ssdLight.resize();
			
			ssdLight.arrayRel = $('a[rel=' + ssdLight.attrRel + ']');
			
			ssdLight.currentIndex = ssdLight.arrayRel.index(obj);
			
			if (ssdLight.arrayRel.length > 1) {
				ssdLight.paging();
			}
			
			$('#lightbox-content').html(imgTag);
			
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			var posTop = (windowHeight/2)-((ssdLight.imgHeight + (ssdLight.imgPaddingVer + ssdLight.toolsHeight)) / 2);
			var posLeft = (windowWidth/2)-((ssdLight.imgWidth + ssdLight.imgPaddingHor) / 2);
			
			$('#lightbox').hide().css({
				'top' : posTop + 'px',
				'left' : posLeft + 'px',
				'width' : ssdLight.imgWidth + 'px',
				'height' : (ssdLight.imgHeight + ssdLight.toolsHeight) + 'px'
			}).fadeIn(500);
			
			ssdLight.hoverTitle();
			ssdLight.bindings();
			
		};
		
		imgObject.src = ssdLight.attrImg;
		
	},
	bindings : function() {
	
		$('#lightbox-prev, #lightbox-next').live('click', function() {
			ssdLight.replace($(this));
			return false;
		});
		
		$(window).resize(function() {
			ssdLight.position();
		});
	
	},
	position : function() {
		
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var posTop = (windowHeight/2)-((ssdLight.imgHeight + (ssdLight.imgPaddingVer + ssdLight.toolsHeight)) / 2);
		var posLeft = (windowWidth/2)-((ssdLight.imgWidth + ssdLight.imgPaddingHor) / 2);
		
		$('#lightbox').animate({
			'top' : posTop + 'px',
			'left' : posLeft + 'px',
			'width' : ssdLight.imgWidth + 'px',
			'height' : (ssdLight.imgHeight + ssdLight.toolsHeight) + 'px'
		}, { duration : 200, queue : false });
		
	},
	replace : function(obj) {
		
		$('#currentImage').fadeOut(300, function() {
			
			$(this).replaceWith($(ssdLight.containerPreload).fadeIn(300));
			
			var thisId = obj.attr('id');
			
			switch(thisId) {
				case 'lightbox-prev':
				if (ssdLight.currentIndex > 0) {
					ssdLight.currentIndex = (ssdLight.currentIndex -1);
				}
				break;
				case 'lightbox-next':
				if (ssdLight.currentIndex < ssdLight.arrayRel.length) {
					ssdLight.currentIndex = (ssdLight.currentIndex +1);
				}
				break;
			}
			
			ssdLight.paging();
			
			ssdLight.attrRel = $(ssdLight.arrayRel[ssdLight.currentIndex]).attr('rel');
			ssdLight.attrTitle = $(ssdLight.arrayRel[ssdLight.currentIndex]).attr('title');
			ssdLight.attrImg = $(ssdLight.arrayRel[ssdLight.currentIndex]).attr('href');
			
			var imgObject = new Image();
			
			imgObject.onload = function() {
				
				ssdLight.imgHeight = imgObject.height;
				ssdLight.imgWidth = imgObject.width;
				
				ssdLight.position();
				
				ssdLight.resizeAnimate($('#lightbox-wrapper, #lightbox-content, #lightbox-tools'), ssdLight.loadImage);
				
			};
			
			imgObject.src = ssdLight.attrImg;
			
		});
		
	},
	loadImage : function() {
		
		var imgTag = '<img src="' + ssdLight.attrImg + '" id="currentImage" ';
		imgTag += 'alt="' + ssdLight.attrTitle + ' width="' + ssdLight.imgWidth + '" ';
		imgTag += 'height="' + ssdLight.imgHeight + '" />';
		
		$('#lightbox-content').html($(imgTag).fadeIn(300));
		
		ssdLight.hoverTitle();
		
	},
	resizeAnimate : function(elements, callBackFnk) {
		
		elements.each(function() {
			
			switch($(this).attr('id')) {
				case 'lightbox-wrapper':
				$(this).animate({
					'width' : ssdLight.imgWidth + 'px',
					'height' : (ssdLight.imgHeight + ssdLight.toolsHeight) + 'px' 
				}, {
					duration : 200,
					queue : false
				});
				break;
				case 'lightbox-content':
				$(this).animate({
					'width' : ssdLight.imgWidth + 'px',
					'height' : ssdLight.imgHeight + 'px' 
				}, {
					duration : 200,
					queue : false
				});
				break;
				case 'lightbox-tools':
				$(this).animate({
					'width' : ssdLight.imgWidth + 'px' 
				}, {
					duration : 200,
					queue : false
				});
				break;
			}
			
		});
		
		elements.promise().done(callBackFnk);
		
	},
	hoverTitle : function() {
	
		if (ssdLight.titleDisplay) {
			$('#lightbox-content').hover(function() {
				$('#lightbox-content').append($('<div id="lightbox-title">' + ssdLight.attrTitle + '</div>').hide());
				var w = $('#lightbox-title').width();
				$('#lightbox-title').css('left', (ssdLight.imgWidth/2) - ((w/2) + ssdLight.imgPaddingHor) + 'px').show();
			}, function() {
				$('#lightbox-title').remove();
			});
		}
	
	},
	paging : function() {
	
		if (ssdLight.currentIndex === 0) {
			$('#lightbox-next').show();
			$('#lightbox-next-inactive').hide();
			$('#lightbox-prev').hide();
			$('#lightbox-prev-inactive').show();
		} else if ((ssdLight.currentIndex + 1) === ssdLight.arrayRel.length) {
			$('#lightbox-next').hide();
			$('#lightbox-next-inactive').show();
			$('#lightbox-prev').show();
			$('#lightbox-prev-inactive').hide();
		} else {
			$('#lightbox-next').show();
			$('#lightbox-next-inactive').hide();
			$('#lightbox-prev').show();
			$('#lightbox-prev-inactive').hide();
		}
	
	},
	resize : function() {
		
		$('#lightbox-wrapper').css({ 
			'width' : ssdLight.imgWidth + 'px', 
			'height' : (ssdLight.imgHeight + ssdLight.toolsHeight) + 'px'
		});
		
		$('#lightbox-content').css({ 
			'width' : ssdLight.imgWidth + 'px', 
			'height' : ssdLight.imgHeight + 'px'
		});
		
		$('#lightbox-tools').css({ 
			'width' : ssdLight.imgWidth + 'px'
		});
		
	},
	liveClose : function() {
		
		$('#lightbox-close').live('click', function() {
			ssdLight.close();
			return false;
		});
		
		$('#overlay').live('click', function() {
			ssdLight.close();
			return false;
		});
		
	},
	close : function() {
		
		$('#lightbox').fadeOut(300, function() {
			$('#overlay').fadeOut(300, function() {
				$('#lightbox').remove();
				$('#overlay').remove();
			});
		});
		
	}
};

$(document).ready(function(){
	
	$('a.lightbox').click(function() {
		ssdLight.run($(this));
		return false;
	});

});