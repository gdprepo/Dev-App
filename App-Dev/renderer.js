(function(){
    'use strict'

    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');
    const systemEvents = {
        "EVENT_FETCHED_PRODUCTS" : "got-product-list",
        "EVENT_FETCHED_COMMANDS" : "got-command-list",
        "EVENT_FETCHED_CATEGORIES" : "got-category-list",
        "EVENT_CART_UPDATED" : "update-cart",
        "EVENT_USER_AUTHENTIFY" : "user-authentify",
        "EVENT_UPDATE_AUTHENTIFY" : "update-authentify",
        "EVENT_USER_REGISTER" : "user-register"
    }
    const displayEvents = {
        "EVENT_PRODUCT_ADDED_TO_CART" : "add-product-to-cart",
        "EVENT_PRODUCT_FILTERED_BY_CATEGORY" : "filter-product-by-category",
        "EVENT_SETUP" : "setup",
        "EVENT_INIT_CART" : "init-cart",
    }

    const categoryFilter = []

    ipcRenderer.on(systemEvents.EVENT_FETCHED_PRODUCTS, (event, productList) => {
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
                ipcRenderer.send(displayEvents.EVENT_PRODUCT_ADDED_TO_CART, product)
            })
            tableTr.append(button)
        })

    });

    ipcRenderer.on(systemEvents.EVENT_FETCHED_CATEGORIES, (event, categoryList) => {
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
                ipcRenderer.send(displayEvents.EVENT_PRODUCT_FILTERED_BY_CATEGORY, categoryFilter)
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
        ipcRenderer.send(displayEvents.EVENT_SETUP, {token:localStorage.getItem("token"), user:JSON.parse(localStorage.getItem("user"))})
    }

    ipcRenderer.on(systemEvents.EVENT_USER_AUTHENTIFY, (event, userObject) => {
        localStorage.setItem("token", userObject.token);
        localStorage.setItem("user", JSON.stringify(userObject.user));

        window.location.href = "./index.html";
    });

    ipcRenderer.on(systemEvents.EVENT_USER_REGISTER, (event) => {
        window.location.href = "./login.html";
    });

    if (localStorage.getItem("cart")) {
        ipcRenderer.send(displayEvents.EVENT_INIT_CART, JSON.parse(localStorage.getItem("cart")))
    }
    
    ipcRenderer.on(systemEvents.EVENT_CART_UPDATED, (event, cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    });

    // displayCart()

    // function displayCart() {
    //     let listcart = $('#cart')
    //     listcart.empty();

    //     let cart = JSON.parse(localStorage.getItem("cart"))
    //     console.log(cart.product.length)
    //     if (cart.product.length > 0) {
    //         cart.product.forEach(function(product) {

    //             let liProduct = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
    //             liProduct.append('<a href="./product/' + product.id +'_product.html">' + '<img class="imgCart" src="'+ product.image  +'"></img>' + '</a>')
    //             liProduct.append(product.title + " " + product.prix + " €")
    //             listcart.append(liProduct)
    //             let button = $('<button type="button" class="btn btn-primary btn-cart">Supprimer</button>');
    //             button.click( function () {
    //                 ipcRenderer.send("remove-product-cart", product)
    //             })
    //             liProduct.append(button)
    //             //listcart.append(listcart)
    //         })
    //         let liSend = $('<li class="list-group-item list-group-item-action list-group-item-light"></li>')
    //         let btnSendCart = $('<button type="button" class="btn btn-primary">Enregistrer</button>');
    //         btnSendCart.click( function () {
    //             ipcRenderer.send("send-cart", cart);
    //         })
    //         listcart.append(liSend)

    //         liSend.append(btnSendCart)
    //     }

    // }

    if (localStorage.getItem("user")) {
        let user = JSON.parse(localStorage.getItem("user"))
        let mailProfil = $('#profilEmail')
        let pseudo = $('#profilPseudo')
        let image = $('#profilImg')
        
        image.append('<img style="width: 50%;" class="rounded" src="'+ user.image  +'"></img>')

    
        mailProfil.append(user.mail)
        pseudo.append(user.name)

    }

    let showList = $('#showCategorie')
    showList.click( function () {
        let element = document.getElementById("listShow");
        if (element.style.display == "block") {
            element.style.display = "none";
        } else {
            element.style.display = "block";

        }
    })

    // let btnLogin = $('#loginbtn')

    // btnLogin.click( function () {

    //     var data = {
    //         mail : $('#inputmail').val(),
    //         password : $('#inputpassword').val(),
    //     }

    //     console.log(data)
        
    //     ipcRenderer.send("login-param", data);
    // }) 

    let logout = $('#logout')
    
    logout.click( function () {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "./index.html";

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

})()
