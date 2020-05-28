(function(){
    'use strict'

    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');

    function createRowForCommand(command)
    {
        let li = $('<li class="list-group-item"></li>');

        const liData = [
            '<p class="font-weight-bold blockquote text-center"> Commande n°'+ command.id + ' ' +command.status+' pour '+command.user.name +'</p>',
            '<h6 class="font-weight-light text-right">' + command.date + '</h6>',
        ]
        refreshList(li, liData)
        
        return li
    }

    function createRowForProduct(product)
    {
        
        let liProduct = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')

        const liData = [
            product.title + " " + product.prix + " €",
            '<a href="./product/' + product.id +'_product.html">' + '<img class="imgCommand" src="'+ product.image  +'"></img>' + '</a>',
        ]

        refreshList(liProduct, liData)


        return liData
    }

    ipcRenderer.on("got-command-list", (event, commandList) => {
        let rows = []

        commandList.forEach(function(command){
            let productRows = []
            let name = command.user.name
            let total = 0

            let row = createRowForCommand(command)
            command.products.forEach(function(product) {
                let productRow = createRowForProduct(product)
                productRows.push(productRow)
                total += parseInt(product.prix)
            })

            let ulProduct = $('<ul class="list-group"></ul>')
            refreshList(ulProduct, productRows)

            row.append(ulProduct)
            rows.push(row)
            let liPrix = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
            liPrix.append( 'Le prix de total de votre commande est de : ' + total + '€')
            rows.push(liPrix)
        })
        // let confirmer = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
        // let btnconfirmer = $('<button style="width:100%" type="button" class="btn btn-primary">Confirmer</button>');
        // btnconfirmer.click( function () {
        //     var data = {
        //         token : localStorage.getItem('token'),
        //         total : total,
        //     }
        //     ipcRenderer.send("confirmer-command", data)
        // })
        // confirmer.append(btnconfirmer)
        // rows.push(confirmer)

        let list = $('#list-command')
        refreshList(list, rows);

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
            let total = 0
            cart.product.forEach(function(product) {

                let liProduct = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
                liProduct.append('<a href="./product/' + product.id +'_product.html">' + '<img class="imgCart" src="'+ product.image  +'"></img>' + '</a>')
                liProduct.append(product.title + " " + product.prix + " €")
                listcart.append(liProduct)
                let button = $('<button id="add_product" type="button" class="btn btn-primary btn-cart">Supprimer</button>');
                button.click( function () {
                    ipcRenderer.send("remove-product-cart", product)
                })
                liProduct.append(button)
                total += parseInt(product.prix)
            })
            let liPrix = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
            liPrix.append( 'Le prix de total de votre commande est de : ' + total + '€')
            listcart.append(liPrix)

            let liSend = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
            let btnSendCart = $('<button style="width:100%" type="button" class="btn btn-primary">Enregistrer</button>');
            btnSendCart.click( function () {
                ipcRenderer.send("send-cart", cart);
                var data = {
                    token : localStorage.getItem('token'),
                    total : total,
                }
                ipcRenderer.send("confirmer-command", data)
            })
            listcart.append(liSend)

            liSend.append(btnSendCart)
        }

    }

})()