(function(){
    'use strict'

    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');

    ipcRenderer.on("got-product-list", (event, productList) => {
        let list = $('#listProductFemme')
        list.empty();
        productList.forEach(function(product){
            product.categories.forEach(function(category){
                if (category.title == "Femme") {
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
                }

            })

        })

    });

})()
