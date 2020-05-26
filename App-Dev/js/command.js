(function(){
    'use strict'

    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');


    ipcRenderer.on("got-command-list", (event, commandList) => {

        let list = $('#list-command')
        let name = ""
        let total = 0

        commandList.forEach(function(command){
            name = command.user.name
            total = 0
            let li = $('<li class="list-group-item"></li>');
            li.append('<p class="font-weight-bold blockquote text-center"> Commande n°'+ command.id + ' ' +command.status+' pour '+command.user.name +'</p>')
            li.append('<h6 class="font-weight-light text-right">' + command.date + '</h6>')
            let ulProduct = $('<ul class="list-group"></ul>')
            command.products.forEach(function(product) {
                let liProduct = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
                liProduct.append(product.title + " " + product.prix + " €")
                liProduct.append('<a href="./product/' + product.id +'_product.html">' + '<img class="imgCommand" src="'+ product.image  +'"></img>' + '</a>')
                ulProduct.append(liProduct)
                total += parseInt(product.prix)
            })
            li.append(ulProduct)
            list.append(li)
            let liPrix = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
            liPrix.append( 'Le prix de total de votre commande est de : ' + total + '€')
            list.append(liPrix)
        })
        let confirmer = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
        let btnconfirmer = $('<button style="width:100%" type="button" class="btn btn-primary">Confirmer</button>');
        btnconfirmer.click( function () {
            var data = {
                token : localStorage.getItem('token'),
                total : total,
            }
            ipcRenderer.send("confirmer-command", data)
        })
        confirmer.append(btnconfirmer)
        list.append(confirmer)

    });

    // if (localStorage.getItem("cart")) {
    //     ipcRenderer.send("init-cart", JSON.parse(localStorage.getItem("cart")))
    // }
    
    ipcRenderer.on("update-cart", (event, cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart()
    });

    if (localStorage.getItem("cart")) {
        displayCart()
    }

    function displayCart() {
        let listcart = $('#cart')
        listcart.empty();

        let cart = JSON.parse(localStorage.getItem("cart"))

        if (cart.product.length > 0) {
            cart.product.forEach(function(product) {

                let liProduct = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
                liProduct.append('<a href="./product/' + product.id +'_product.html">' + '<img class="imgCart" src="'+ product.image  +'"></img>' + '</a>')
                liProduct.append(product.title + " " + product.prix + " €")
                listcart.append(liProduct)
                let button = $('<button type="button" class="btn btn-primary btn-cart">Supprimer</button>');
                button.click( function () {
                    ipcRenderer.send("remove-product-cart", product)
                })
                liProduct.append(button)
            })
            let liSend = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
            let btnSendCart = $('<button type="button" class="btn btn-primary">Enregistrer</button>');
            btnSendCart.click( function () {
                ipcRenderer.send("send-cart", cart);
            })
            listcart.append(liSend)

            liSend.append(btnSendCart)
        }

    }

})()