(function(){
    'use strict'


    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');



    let btnLogout = $('#logout')

    btnLogout.click( function () {
        window.location.href = "./login.html";
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    })


})()