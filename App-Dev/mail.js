(function(){
    'use strict'

    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');

    const token = "f77c517e-4db0-4442-89f2-0cfa6f1e4ba6";
    const $formContact = document.querySelector("#contact");

    const sendForm = event => {
    event.preventDefault();
    const message = {
        name: document.querySelector("#form-name").value,
        subject: document.querySelector("#form-subject").value,
        text: document.querySelector("#form-message").value
    };
    smtpJS(message);
    };
    const smtpJS = message => {
    try {
        Email.send(
        "gabin.depaire@ynov.com",
        `${message.name} - ${message.subject}`,
        message.text,
        { token }
        );
    } catch (e) {
        alert("Erro");
    }
    };

    $formContact.addEventListener("submit", sendForm);


})()
