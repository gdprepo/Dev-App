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
        
        ipcRenderer.send("login-param", data);
    }) 



})()