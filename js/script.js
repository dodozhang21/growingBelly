// init global
var menuLeft = $('.growingBelly .menuLeft')
	,showSelection = $('.growingBelly .showSelection')
	,monthSelection = $('.growingBelly .months')
	,angle = $('.growingBelly #angle')
	,monthText = $('.growingBelly .monthText')
	,angleSelect = $('.growingBelly #accordion .angles li')
	,accordion = $('.growingBelly #accordion')
	,prevAngle = $(".growingBelly #prevAngle")
	,nextAngle = $(".growingBelly #nextAngle")
	,swipeWrap = $('.growingBelly #photos .swipe-wrap')
	,selectionTip = $('.growingBelly #selectionOutline,.growingBelly #selectionTip')
	,body = document.body
	,monthSelected = defaultMonth
	,modelSelected = defaultModel
	,angleSelected = defaultAngle
	;

var mySwipe = startSlide(0);

$(function() {
	// init
	loadSelection();
	// selection tip fade out
	$(document).on('click touch tap', '.growingBelly', function() {
		hideSelectionTip();
	});
	$(selectionTip).show();
		setTimeout(function() {
		$(selectionTip).fadeOut();
	}, 3000);

	$(prevAngle).click(function() {mySwipe.prev();});
	$(nextAngle).click(function() {mySwipe.next();});

	// menu
	$(showSelection).click(function() {
		toggleMenu();
	});
	$(accordion).accordion();


	// other elements
	$(angleSelect).click(function() {
		modelSelected = $(this).attr('model');
		angleSelected = $(this).attr('angle');
		loadSelection();
		toggleMenu();
	});

	$(monthSelection).change(function() {
		monthSelected = $(this).attr("value");
		loadSelection();
		return false;
	});
});

function hideSelectionTip() {
	$(selectionTip).hide();
}

function toggleMenu() {
	$(showSelection).toggleClass('active');
	$(body).toggleClass('cbp-spmenu-push-toright');
	$(menuLeft).toggleClass('cbp-spmenu-open');
}

// for swipe
function angleLoaded(elem) {
	var photo = $(elem).find('.photo');
	var model = $(photo).attr('model');
	var modelAngle = $(photo).attr('angle');
	
	modelSelected = model;
	angleSelected = modelAngle;

	//$(angle).html(angleSelected);
	selectOnMenu();
}

function selectOnMenu() {
	var selectedAngle = $(accordion).find('#'+modelSelected).find("[angle='"+angleSelected+"']");
	$(angleSelect).removeClass('selected');
	$(selectedAngle).addClass('selected');
}

function loadSelection() {
	var monthToUse, modelToUse, angleToUse;

	// verify month is valid
	var monthData = months[monthSelected];
	if(monthData) { 
		monthToUse = monthData;
	} else {
		monthToUse = defaultMonth;
	}

	// verify model is valid
	var modelsData = monthData["models"];
	modelToUse = modelsData[defaultModel];
	for (var x in modelsData) {
		var modelData = modelsData[x];
		if(modelData.name == modelSelected) {
			modelToUse = modelData;
		}
	}

	// verify angle is valid
	var anglesData = modelToUse["angles"];
	angleToUse = anglesData[0]; // first angle available to the model as default
	for (var x in anglesData) {
		var angleData = anglesData[x];
		if(angleData == angleSelected) {
			angleToUse = angleData;
		}
	}

	// update global
	monthSelected = monthToUse.number;
	angleSelected = angleToUse;
	modelSelected = modelToUse.name;

	// populate data
	var selectedAngleIndex = 0
	var index = 0;
	var swipeHtml = "";
	for (x in anglesData) {
		var angleData = anglesData[x];
		if(angleData == angleSelected) {
			selectedAngleIndex = index;
		}
		var imageSrc = getImageSrc(angleData);
		swipeHtml += "<div class='wrap'><img src='" + imageSrc + "' width='"+imageWidth+"' height='"+imageHeight+"' model='" + modelSelected + "' class='photo' angle='" + angleData + "' alt='" + angleData + "' /></div>";
		index++;
	}

	// change the month selection to monthSelected
	$(monthSelection).val(monthSelected);

	$(swipeWrap).html(swipeHtml);
	//$(angle).html(angleToUse);
	selectOnMenu();
	$(monthText).html(monthToUse.text);
	
	mySwipe = startSlide(selectedAngleIndex);
}

function getImageSrc(angle) {
	var imageSrc = imagePath + 'month' + monthSelected + modelSelected + angle + imageExtension;
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