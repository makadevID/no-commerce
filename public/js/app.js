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

  $('#search').keyup(function() {
  	var term = $(this).val();

  	$.ajax({
  		method: 'POST',
  		url: '/api/search/',
  		data: { q: term },
  		dataType: 'json'
  	})
  	.done(function(data) {
  		var suggestions = data.data;
			var dom = '';

			if(data.success) {
				for (var i = 0; i < suggestions.length; i++) {
					dom += '<li class="list-group-item"><a href="/products/"' + suggestions[i]._source.name + '>' + suggestions[i]._source.name + '</a></li>';
					$('#suggest').html(dom);
				}
			} else {
				dom = '<li class="list-group-item"><a href="#">No result found</a></li>';
				$('#suggest').html(dom);
			}
  	});
  });

})(jQuery);
