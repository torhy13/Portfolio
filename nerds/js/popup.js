            var link = document.querySelector(".write-us");
            var popup = document.querySelector(".modal-content");
            var close = document.querySelector(".modal-close");
            
            

            link.addEventListener("click", function(event) {
            event.preventDefault();
            popup.classList.add("modal-content-show"); 
            

            });

            close.addEventListener("click", function(event) {
            event.preventDefault();
            popup.classList.remove("modal-content-show");
      
            });


