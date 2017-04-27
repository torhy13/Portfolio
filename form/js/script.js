$(document).ready(function(){
        
    var navLink = $('.login-nav__item');
    var navLinkpost = $('#post.login-nav__item');
    var navLinkvds = $('#vds.login-nav__item');
    var logo = $('.logo');
    var loginErrors = false;
    var passwordErrors = false;
    var loginInput = $('#login');
    var passwordInput = $('#password');
    var firstSubmit = true;
    var msg = $('.err-message');

	navLink.on("click", function(){
	event.returnValue = false;
	navLink.removeClass("login-nav__item--active"); 
	logo.removeClass('logo--post');
	logo.removeClass('logo--vds');
	$(this).addClass("login-nav__item--active"); 

	});

	
	navLinkpost.on("click", function(){
	event.returnValue = false;
	navLink.removeClass("login-nav__item--active"); 
	$(this).addClass("login-nav__item--active"); 
	logo.addClass('logo--post');

	});

	navLinkvds.on("click", function(){
	event.returnValue = false;
	navLink.removeClass("login-nav__item--active"); 
	$(this).addClass("login-nav__item--active"); 
	logo.addClass('logo--vds');

	});

	//form

    $(".login-form").on('submit', function (event)  {
        
        checkInputs();
        
        if (firstSubmit){
            loginInput.on('input', function() {
                checkInputs();
            });

            passwordInput.on('input', function() {
                checkInputs();
            });
            firstSubmit = false;
        }

        if (loginErrors || passwordErrors) { 
            event.preventDefault(); 
            msg.addClass('err-message--show');
        } else {
            msg.removeClass('err-message--show');
        }
    });

    function checkInputs() {
        var login = loginInput.val();
        var password = passwordInput.val();
        if (login.length < 3) {
            loginErrors = true;
        } else {
            msg.removeClass('err-message--show');
            loginErrors = false;
        }

        if (password.length < 3) {
            passwordErrors = true;
        } else {
            msg.removeClass('err-message--show');
            passwordErrors = false;
        }
    }
  
});