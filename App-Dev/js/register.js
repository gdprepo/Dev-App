(function(){
    'use strict'


    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');



    let btnLogin = $('#registerbtn')

    btnLogin.click( function () {

        var data = {
            name : $('#inputname').val(),
            mail : $('#inputmail').val(),
            password : $('#inputpassword').val(),
            image : $('#inputimage').val(),

        }
        console.log(data)
        if (data.mail && data.password && data.mail && data.password && data.image) {
            ipcRenderer.send("register-param", data);
        } else {
            let element = document.getElementById("erreur");

            element.style.display = "block";
        }
    })

    ipcRenderer.on("update-authentify", (event) => {
        let element = document.getElementById("erreur");

        element.style.display = "block";
    })



})()