window.onload = function (){
    console.log("hola")
    let from = document.getElementById("from");
    let to = document.getElementById("to");

    var typingTimer;                //timer identifier
    var typingTimer2;                //timer identifier
    var doneTypingInterval = 2000;  //time in ms, 5 seconds for example
    
    from.addEventListener('focus', function(){
        console.log("foco")
        this.parentNode.appendChild(document.getElementById("dropdown"));
    })

    to.addEventListener('focus', function(){
        console.log("foco")
        this.parentNode.appendChild(document.getElementById("dropdown"));
    })

    from.addEventListener('keyup', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(getAutocomplete, doneTypingInterval, 'from');
    })

    from.addEventListener('keydown', () => {
        clearTimeout(typingTimer);
    })

    to.addEventListener('keyup', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(getAutocomplete, doneTypingInterval, 'to');
    })

    to.addEventListener('keydown', () => {
        clearTimeout(typingTimer);
    })

    function getAutocomplete(val) {
        const query = val === "to" ? to.value : from.value;
        let url = "http://localhost:4500/autocomplete?query=" + query
        fetch(url)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.getElementById("dropdown");
            dropdown.innerHTML = "";
            data.forEach(element => {
                console.log(element)
                let option = document.createElement("option");
                option.value = element.id;
                option.innerHTML = element.main_text
                dropdown.appendChild(option);
            });
        })
    }   

}

// function initMap() {
//     console.log("maps arriba")
//     const from = document.getElementById("from");
//     const options = {
//         fields: ["formatted_address", "geometry", "name"],
//         strictBounds: false,
//         types: ["address"],
//     };

//     // const autocomplete = new google.maps.places.Autocomplete(from, options);
//     google.maps.places
// }
// window.initMap = initMap