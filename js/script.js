// main
var mainNavMenu = $('#mainNavButton') 
	,mainNavMenuRight = $('#siteNavContainer')
	,body = document.body;


// all push menu button should have the class .pushMenu and an UNIQUE id, that ID is the key for the pushMenuFunctions
var pushMenuFunctions = {
	'mainNavButton' : function() {
		$(mainNavMenu).toggleClass('active');
		$(body).toggleClass('cbp-spmenu-push-toleft');
		$(mainNavMenuRight).toggleClass('cbp-spmenu-open');
		disablePushMenusExcept('mainNavButton');
	},
	'growingBellyShowModels' : function() {
		$(growingBellyShowSelection).toggleClass('active');
		$(body).toggleClass('cbp-spmenu-push-toright');
		$(growingBellyMenuLeft).toggleClass('cbp-spmenu-open');
		disablePushMenusExcept('growingBellyShowModels');
		$('html, body').animate({scrollTop: $('#growingBellyShowModels').offset().top - 15}, 0);
	}
};

// close push menus on main content touch
$(document).on('click touchstart tap', '#siteContainer', function() {
	if($(mainNavMenu).hasClass('active')) {
		pushMenuFunctions['mainNavButton']();
	}
});


// init global
var growingBellyMenuLeft = $('.growingBelly .menuLeft')
	,growingBellyShowSelection = $('.growingBelly .showSelection')
	,growingBellyMonthSelection = $('.growingBelly .months')
	,growingBellyMonthText = $('.growingBelly .monthText')
	,growingBellyAngleSelect = $('.growingBelly #accordion .angles li')
	,growingBellyAccordion = $('.growingBelly #accordion')
	,growingBellyPrevAngle = $(".growingBelly #prevAngle")
	,growingBellyNextAngle = $(".growingBelly #nextAngle")
	,growingBellySwipeWrap = $('.growingBelly #photos .swipe-wrap')
	,growingBellyMonthSelected = growingBellyDefaultMonth
	,growingBellyModelSelected = growingBellyDefaultModel
	,growingBellyAngleSelected = growingBellyDefaultAngle
	;

var mySwipe = startSlide(0);
var selectionTipShown = 0;
// show selection tip once once the app is scrolled into view
$(window).scroll(function(event) {
  
  $(growingBellyShowSelection).each(function(i, el) {
    var el = $(el);
    if (el.visible(true) && !selectionTipShown) {
      el.addClass("highlighted"); 
	  setTimeout(function() {
		hideSelectionTip();
	  }, 3000);
	  selectionTipShown = 1;
    } 
  });
  
});

$(function() {
	$(mainNavMenu).click(function() {
		pushMenuFunctions['mainNavButton']();
	});
	// init
	loadSelection();
	// selection tip fade out
	$(document).on('click touchstart tap', '.growingBelly', function() {
		hideSelectionTip();
	});

	$(growingBellyPrevAngle).click(function() {mySwipe.prev();});
	$(growingBellyNextAngle).click(function() {mySwipe.next();});

	// menu
	$(growingBellyShowSelection).click(function() {
		pushMenuFunctions['growingBellyShowModels']();
	});
	$(growingBellyAccordion).accordion();


	// other elements
	$(growingBellyAngleSelect).click(function() {
		growingBellyModelSelected = $(this).attr('model');
		growingBellyAngleSelected = $(this).attr('angle');
		loadSelection();
		pushMenuFunctions['growingBellyShowModels']();
	});

	$(growingBellyMonthSelection).change(function() {
		growingBellyMonthSelected = $(this).attr("value");
		loadSelection();
		return false;
	});

	// main nav accordion
	$('#mainNavAccordion').accordion({'active':false,autoHeight:false,collapsible: true});

});

function hideSelectionTip() {
	$(growingBellyShowSelection).removeClass("highlighted");
}

// for swipe
function angleLoaded(elem) {
	var photo = $(elem).find('.photo');
	var model = $(photo).attr('model');
	var modelAngle = $(photo).attr('angle');
	
	growingBellyModelSelected = model;
	growingBellyAngleSelected = modelAngle;

	selectOnMenu();
}

function selectOnMenu() {
	var selectedAngle = $(growingBellyAccordion).find('#'+growingBellyModelSelected).find("[angle='"+growingBellyAngleSelected+"']");
	$(growingBellyAngleSelect).removeClass('selected');
	$(selectedAngle).addClass('selected');
}

function loadSelection() {
	var monthToUse, modelToUse, angleToUse;

	// verify month is valid
	var monthData = growingBellyMonths[growingBellyMonthSelected];
	if(monthData) { 
		monthToUse = monthData;
	} else {
		monthToUse = growingBellyDefaultMonth;
	}

	// verify model is valid
	var modelsData = monthData["models"];
	modelToUse = modelsData[growingBellyDefaultModel];
	for (var x in modelsData) {
		var modelData = modelsData[x];
		if(modelData.name == growingBellyModelSelected) {
			modelToUse = modelData;
		}
	}

	// verify angle is valid
	var anglesData = modelToUse["angles"];
	angleToUse = anglesData[0]; // first angle available to the model as default
	for (var x in anglesData) {
		var angleData = anglesData[x];
		if(angleData == growingBellyAngleSelected) {
			angleToUse = angleData;
		}
	}

	// update global
	growingBellyMonthSelected = monthToUse.number;
	growingBellyAngleSelected = angleToUse;
	growingBellyModelSelected = modelToUse.name;

	// populate data
	var selectedAngleIndex = 0
	var index = 0;
	var swipeHtml = "";
	for (x in anglesData) {
		var angleData = anglesData[x];
		if(angleData == growingBellyAngleSelected) {
			selectedAngleIndex = index;
		}
		var imageSrc = getImageSrc(angleData);
		swipeHtml += "<div class='wrap'><img src='" + imageSrc + "' width='"+growingBellyImageWidth+"' height='"+growingBellyImageHeight+"' model='" + growingBellyModelSelected + "' class='photo' angle='" + angleData + "' alt='" + angleData + "' /></div>";
		index++;
	}

	// change the month selection to monthSelected
	$(growingBellyMonthSelection).val(growingBellyMonthSelected);

	$(growingBellySwipeWrap).html(swipeHtml);
	//$(angle).html(angleToUse);
	selectOnMenu();
	$(growingBellyMonthText).html(monthToUse.text);
	
	mySwipe = startSlide(selectedAngleIndex);
}

function getImageSrc(angle) {
	var imageSrc = growingBellyImagePath + 'month' + growingBellyMonthSelected + growingBellyModelSelected + angle + growingBellyImageExtension;
	return imageSrc;
}

function startSlide(index) {
	return $('.growingBelly #photos').Swipe({
		startSlide: index,
		speed: 400,
		//auto: 3000,
		continuous: true,
		disableScroll: false,
		stopPropagation: false,
		callback: function(index, elem) {
			angleLoaded(elem);
		},
		transitionEnd: function(index, elem) {}
	}).data('Swipe');
}

function disablePushMenusExcept(exceptionId) {
	var disabledClass = 'disabledPushMenu';
	jQuery.each($('.pushMenu'), function() {
		if($(this).attr('id') == exceptionId) {
			$(this).removeClass(disabledClass);
		} else {
			$(this).toggleClass(disabledClass);
		}
	});
}