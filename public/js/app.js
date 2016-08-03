(function($) {
	'use strict';

	Stripe.setPublishableKey('pk_test_F3i7WSDbmsSdrxe5h1cHfpx6');

	$('#trigger-panel').click(function(e) {
		e.preventDefault();
		$('body').toggleClass('sidepanel-show');
	});

	$('body').on('click', '#sidepanel-overlay', function(e) {
		e.preventDefault();

		$('body').toggleClass('sidepanel-show');
	})

  function stripeResponseHandler(status, response) {
	  var $form = $('#payment-form');

	  if (response.error) {
	    $form.find('.payment-errors').text(response.error.message);
	    $form.find('.submit').prop('disabled', false);
    } else {
    	var token = response.id;
    	$form.append($('<input type="hidden" name="stripeToken">').val(token));
    	$form.get(0).submit();
	  }
	};

  $('#payment-form').submit(function(event) {
  	console.log('submit', $(this));
    $(this).find('.submit').prop('disabled', true);
    Stripe.card.createToken($(this), stripeResponseHandler);
    return false;
  });

})(jQuery);
