$(function() {
	  $(".lang-switch a.lang-switch__item").click(function(e) {
	    e.preventDefault();
	    $('.lang-switch a.lang-switch__item').removeClass('lang-switch__item--active');
	    $(this).addClass('lang-switch__item--active');
	  });

	  $('#ru').click(function(){

		$('.main-title--ru').addClass('show').removeClass('hidden');
		$('.main-title--en').addClass('hidden').removeClass('show');
		$('.copyright--ru').addClass('show').removeClass('hidden');
		$('.copyright--en').addClass('hidden').removeClass('show');

		}); 

	  $('#en').click(function(){

		$('.main-title--en').addClass('show').removeClass('hidden');
		$('.main-title--ru').addClass('hidden').removeClass('show');
		$('.copyright--en').addClass('show').removeClass('hidden');
		$('.copyright--ru').addClass('hidden').removeClass('show');

		}); 

	});