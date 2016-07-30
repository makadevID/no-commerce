(function($) {
	'use strict';

	$('#trigger-panel, #search-btn').click(function(e) {
		e.preventDefault();
		if(this.id === 'search-btn') {
			$('.sidepanel').find('input').focus();
		}
		
		$('body').toggleClass('sidepanel-show');
	});

	$('body').on('click', '#sidepanel-overlay', function(e) {
		e.preventDefault();

		$('body').toggleClass('sidepanel-show');
	})
})(jQuery);