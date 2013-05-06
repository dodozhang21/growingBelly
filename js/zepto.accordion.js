;(function($) {
	$.fn.accordion = function() {
		return this.each(function() {
			var $this = $(this),
				$headings = $this.children('h4'),
				$panels = $this.children('aside'),
				togglePane = function(el) {
					var $heading = $(el),
						$panel= $heading.next(),
						pane_visible = ($panel.css('display') == 'block' ? true : false);
			
					if (pane_visible) {
						$panel.hide();
						$heading.toggleClass('current');
					} else {
						$panels.hide();
						$panel.show();
						$headings.removeClass('current');
						$heading.addClass('current');
					}
				};
		
			$panels.hide();
			
			$.each($headings, function(i, el) {
				new MBP.fastButton(el, function() { togglePane(el) });
			});
		});
	};
})(Zepto);