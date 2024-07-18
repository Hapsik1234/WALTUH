var globalPopupId = 1;

class popup
{
    id = 1;
    color;
    constructor(type, text, title=null)// type - type of popup: 1 - Error, 2 - Warning, 3 - Success; text - the content of message; title - title of popup, "Błąd!", "Ostrzeżenie!" or "Sukces!" by deafult
    {
        this.id = 1;
        console.log("Creating popup " + this.id);
        globalPopupId++;

        if (type <= 3 && type > 0) {    // Checking for type of popup validation
            switch(type) {
                case 1:
                    this.color = "#ff6666";
                    if (!title) {
                        title = "Błąd!";
                    }
                    break
                case 2:
                    this.color = "#e6ac0c";
                    if (!title) {
                        title = "Ostrzeżenie!";
                    }
                    break
                case 3:
                    this.color = "#19dd19";
                    if (!title) {
                        title = "Sukces!";
                    }
                    break
            }
    
            // Creating new popup element
    
            var newPopup = document.createElement('div');
    
            var classList = newPopup.classList;

            classList.add("popup");
            setTimeout(function(animate)
            {
              animate.add("animation");
            }, 500, classList
            );
            // newPopup.className = 'popup'; // Apply styles for the popup
            // newPopup.class
            newPopup.setAttribute('id', `popup_`+this.id);
            console.log("Id of popup " + this.id)
            newPopup.style.backgroundColor = this.color;
            newPopup.innerHTML = `
                <span class="popup-inner close" style="float: right; cursor: pointer; font-size: 30px;">&times;</span>
                <p class="popup-inner">${title}</p>
                <p class="popup-inner">${text}</p>
            `;
            // Append popup
            var popupcontainer = document.getElementById("popup-container");
            popupcontainer.appendChild(newPopup);

            document.getElementById(`popup_${this.id}`).addEventListener("click", () => this.removePopup(this.id, classList) )
            // function(){
            //     this.removePopup(this.id, list);
            // });

            

            setTimeout(this.removePopup, 9500, this.id, classList); // Automatically remove popup to reduce popupspam when indev
            return 0;
    
        } else {    // Returning 1 in case of wrong parameters
            console.error("Wrong popup parameters");
            return 1;
        }
    }
    removePopup(id, classes)
    {
        classes.remove("animation");
        setTimeout(function(identificator){
            console.log("removing popup " + `popup_${identificator}`);
            document.getElementById(`popup_${identificator}`).remove();
        }, 500, id);
        
    }
}