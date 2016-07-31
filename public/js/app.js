(function($) {
	'use strict';

	$('#trigger-panel').click(function(e) {
		e.preventDefault();
		$('body').toggleClass('sidepanel-show');
	});

	$('body').on('click', '#sidepanel-overlay', function(e) {
		e.preventDefault();

		$('body').toggleClass('sidepanel-show');
	})
})(jQuery);