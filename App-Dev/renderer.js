(function(){
    'use strict'

    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');

    const categoryFilter = []

    ipcRenderer.on("got-product-list", (event, productList) => {
        let list = $('#list')
        list.empty();
        productList.forEach(function(product){
            let tableTr = $('<tr></tr>');
            list.append(tableTr)
            let tdTitle = $('<td scope=row></td>');
            tdTitle.append(product.title + ' ' + product.prix + ' €')
            tableTr.append(tdTitle)
            let tdDescription = $('<td scope=row></td>');
            tdDescription.append(product.description)
            tableTr.append(tdDescription)
            let tdImage = $('<td scope=row></td>');
            tdImage.append('<a href="./product/' + product.id +'_product.html">' + '<img class="imgProduct" src="' + product.image + '"></img>' + '</a>')
            tableTr.append(tdImage)
            let button = $('<td scope=row></td>');
            button.append('<button type="button" class="btn btn-primary">Ajouter</button>')
            button.click( function () {
                ipcRenderer.send("add-product-to-cart", product)
            })
            tableTr.append(button)
        })
    });

    ipcRenderer.on("got-command-list", (event, commandList) => {

        let list = $('#list-command')

        commandList.forEach(function(command){
            let li = $('<li class="list-group-item"></li>');
            li.append('<p class="font-weight-bold blockquote text-center"> Commande n°'+ command.id + ' ' +command.status+' pour '+command.user.name + '</p>')
            let ulProduct = $('<ul class="list-group"></ul>')
            command.products.forEach(function(product) {
                let liProduct = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
                liProduct.append(product.title + " " + product.prix + " €")
                liProduct.append('<a href="./product/' + product.id +'_product.html">' + '<img class="imgCommand" src="'+ product.image  +'"></img>' + '</a>')
                ulProduct.append(liProduct)
                
            })
            li.append(ulProduct)
            list.append(li)
        })
    });

    ipcRenderer.on("got-category-list", (event, categoryList) => {
        let list = $('#list-category')
        categoryList.forEach(function(category){
            let li = $('<li class="list-group-item" id= "category'+  category.id  +'"></li>');
            li.append('<p style="margin-top: 35px">'+ category.title +'</p>')
            li.append('<img class="imgCategory img-thumbnail" src="'+ category.image  +'"></img>')
            list.append(li)
            li.click( function () {
                if  ( categoryFilter.indexOf(category) !== -1) {
                    categoryFilter.splice(categoryFilter.indexOf(category), 1);
                } else {
                    categoryFilter.push(category);
                }
                ipcRenderer.send("filter-product-by-category", categoryFilter)
                var element = document.getElementById("category" + category.id);
                if (element.classList == "list-group-item mystyle") {
                    element.classList.remove("mystyle");
                } else {
                    element.classList.add("mystyle");          
                }

            })
        })
    });

    if (localStorage.getItem("token")) {
        ipcRenderer.send("setup", {token:localStorage.getItem("token"), user:JSON.parse(localStorage.getItem("user"))})
    }

    ipcRenderer.on("user-authentify", (event, userObject) => {
        localStorage.setItem("token", userObject.token);
        localStorage.setItem("user", JSON.stringify(userObject.user));

        window.location.href = "./index.html";
    });

    if (localStorage.getItem("cart")) {
        ipcRenderer.send("init-cart", JSON.parse(localStorage.getItem("cart")))
    }
    
    ipcRenderer.on("update-cart", (event, cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart()
    });

    displayCart()


    function displayCart() {
        let listcart = $('#cart')
        listcart.empty();

        let cart = JSON.parse(localStorage.getItem("cart"))
        if (cart) {
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
                listcart.append(listcart)
            })
            let btnSendCart = $('<button type="button" class="btn btn-primary btn-cart">Enregistrer</button>');
            btnSendCart.click( function () {
                ipcRenderer.send("send-cart", cart);
            })
            listcart.append(btnSendCart)
            
        }

    }



    let btnLogin = $('#loginbtn')
    btnLogin.click( function () {

        var data = {
            mail : $('#inputmail').val(),
            password : $('#inputpassword').val(),
        }

        console.log(data)
        
        ipcRenderer.send("login-param", data);
    })

    let showList = $('#showCategorie')
    showList.click( function () {
        let element = document.getElementById("listShow");
        if (element.style.display == "block") {
            element.style.display = "none";
        } else {
            element.style.display = "block";

        }
    })

    let loginDiv = document.getElementById("loginDiv")
    let logoutDiv = document.getElementById("logoutDiv")
    let commandDiv = document.getElementById("commandDiv")


    if (localStorage.getItem("token")) {
        loginDiv.style.display = "none";
        logoutDiv.style.display = "block";
        commandDiv.style.display = "block";
    } else {
        loginDiv.style.display = "block";
        logoutDiv.style.display = "none";
        commandDiv.style.display = "none";

    }

    let logout = $('#logout')
    
    logout.click( function () {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    })

    if (localStorage.getItem("user")) {
        let user = JSON.parse(localStorage.getItem("user"))
        let mailProfil = $('#profilEmail')
    
        mailProfil.append(user.mail)
    }


})()
