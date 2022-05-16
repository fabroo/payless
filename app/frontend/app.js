window.onload = function (){
    console.log("hola")
    let from = document.getElementById("from");
    let fromDataList = document.getElementById("fromDataList");
    let toDataList = document.getElementById("toDataList");
    let to = document.getElementById("to");
    let calculate = document.getElementById("calculate");

    // calculate.addEventListener("click", function(){
    //     let from_value = from.value;
    //     let to_value = to.value;
    //     let url = "http://localhost:4500/autocomplete" + from_value + "&symbols=" + to_value;
    //     fetch(url)
    //     .then(function(response){
    //         return response.json();
    //     })
    //     .then(function(data){
    //         console.log(data);
    //         let rate = data.rates[to_value];
    //         let amount = document.getElementById("amount").value;
    //         let result = amount * rate;
    //         document.getElementById("result").innerHTML = result;
    //     })
    // }
    // )
    var typingTimer;                //timer identifier
    var typingTimer2;                //timer identifier
    var doneTypingInterval = 2000;  //time in ms, 5 seconds for example
    
    from.addEventListener('keyup', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(getAutocomplete('from'), doneTypingInterval);
    })

    from.addEventListener('keydown', () => {
        clearTimeout(typingTimer);
    })

    to.addEventListener('keyup', () => {
        clearTimeout(typingTimer2);
        typingTimer2 = setTimeout(getAutocomplete('to'), doneTypingInterval);
    })

    to.addEventListener('keydown', () => {
        clearTimeout(typingTimer2);
    })

    getAutocomplete = (destination) => {
        let from_value = from.value;
        let to_value = to.value;
        let url = `http://localhost:4500/autocomplete?query=${destination == 'to' ? to_value : from_value}` ;
        fetch(url)
        .then(function(response){
            console.log(response);
            return response.json();
        })
        .then(function(data){
            // let rate = data.rates[to_value];
            // let amount = document.getElementById("amount").value;
            // let result = amount * rate;
            if (destination == "from") fromDataList.innerHTML = "";
            else toDataList.innerHTML = "";
            for(element of data){
                var opt = document.createElement('option');
                opt.value = element.main_text;
                opt.innerHTML = element.secondary_text;
                opt.id = element.id;
                if (destination == "from") fromDataList.appendChild(opt);
                else toDataList.appendChild(opt);
                // fromDataList.innerHTML += `<option value=${element.id}> ${ element.main_text + " " + element.secondary_text})} "</option>`;
            }
            console.log(data);
            // document.getElementById("result").innerHTML = result;
        })
    }

    calculate.addEventListener("click", function(){
        console.log("VIAJANDO DESDE", from.value, "HASTA", to.value);
    })


}