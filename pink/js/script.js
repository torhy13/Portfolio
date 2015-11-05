var link = document.querySelector(".main-menu");
var popup = document.querySelector(".main-menu__dropdown");



link.addEventListener("click", function(event) {
event.preventDefault();
popup.classList.toggle("main-menu__dropdown--show");
link.classList.toggle("main-menu__dropdown--close");



});

