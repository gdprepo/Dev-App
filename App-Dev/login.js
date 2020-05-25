(function(){
    'use strict'


    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');



    let btnLogin = $('#loginbtn')

    btnLogin.click( function () {

        var data = {
            mail : $('#inputmail').val(),
            password : $('#inputpassword').val(),
        }
        if (data.mail && data.password) {
            ipcRenderer.send("login-param", data);
        } else {
            let element = document.getElementById("erreur");

            element.style.display = "block";
        }
    })

    ipcRenderer.on("update-authentify", (event) => {
        console.log("coucou")
        let element = document.getElementById("erreur");

        element.style.display = "block";
    })



})()