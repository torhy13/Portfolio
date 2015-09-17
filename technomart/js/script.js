var link = document.querySelector(".about-right a");
var popup = document.querySelector(".modal-content");
var close = document.querySelector(".modal-close");
var cancel = document.querySelector(".cancel-btn");
var map = document.querySelector(".map");
var map_popup = document.querySelector(".map-popup");
var map_popup_close = document.querySelector(".map-close");



link.addEventListener("click", function(event) {
event.preventDefault();
popup.classList.add("modal-content-show");


});

close.addEventListener("click", function(event) {
event.preventDefault();
popup.classList.remove("modal-content-show");
      
});

cancel.addEventListener("click", function(event) {
event.preventDefault();
popup.classList.remove("modal-content-show");

});

map.addEventListener("click", function(event) {
event.preventDefault();
map_popup.classList.add("map-popup-show");

});

map_popup_close.addEventListener("click", function(event) {
event.preventDefault();
map_popup.classList.remove("map-popup-show");

});

/*прокрутка*/

$(function() {
 
$(window).scroll(function() {
 
if($(this).scrollTop() != 0) {
 
$('#toTop').fadeIn();
 
} else {
 
$('#toTop').fadeOut();
 
}
 
});
 
$('#toTop').click(function() {
 
$('body,html').animate({scrollTop:0},800);
 
});
 
});