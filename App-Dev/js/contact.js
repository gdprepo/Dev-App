(function(){
    'use strict'


    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');



    let btnContact = $('#contactbtn')

    btnContact.click( function () {

        var data = {
            mail : $('#inputmail').val(),
            message : $('#inputmessage').val(),
        }
        console.log(data)
        if (data.mail && data.message) {
            ipcRenderer.send("contact-param", data);
        } else {
            let element = document.getElementById("erreur");

            element.style.display = "block";
        }
    })

    // ipcRenderer.on("update-authentify", (event) => {
    //     console.log("coucou")
    //     let element = document.getElementById("erreur");

    //     element.style.display = "block";
    // })



})()