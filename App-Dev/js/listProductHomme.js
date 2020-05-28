(function(){
    'use strict'

    const electron = require('electron')
    const { ipcRenderer } = electron
    window.$ = window.jQuery = require('jquery');

    const categoryFilter = []

    ipcRenderer.on("got-category-list", (event, categoryList) => {
        let list = $('#list-category')
        categoryList.forEach(function(category){
            if (category.title != "Femme" && category.title != "Homme") {
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
            }
        })
    });


    ipcRenderer.on("got-product-list", (event, productList) => {
        let list = $('#listProductHomme')
        list.empty();
        productList.forEach(function(product){
            product.categories.forEach(function(category){
                if (category.title == "Homme") {
                    let tableTr = $('<tr></tr>');
                    list.append(tableTr)
                    let tdTitle = $('<td scope=row></td>');
                    tdTitle.append(product.title + ' ' + product.prix + ' €')
                    tableTr.append(tdTitle)
                    let tdDescription = $('<td scope=row></td>');
                    tdDescription.append(product.description)
                    tableTr.append(tdDescription)
                    let tdImage = $('<td scope=row></td>');
                    tdImage.append('<a>' + '<img class="imgProduct" src="' + product.image + '"></img>' + '</a>')
                    tableTr.append(tdImage)

                    let element = document.getElementById("add_product")
                    if (localStorage.getItem('token')) {
                        let button = $('<td scope=row></td>');
                        button.append('<button type="button" class="btn btn-primary">Ajouter</button>')
                        button.click( function () {
                            ipcRenderer.send("add-product-to-cart", product)
                        })
                        tableTr.append(button)
                        element.style.display = "block"
                    } else {
                        element.style.display = "none"
                    }

                }

            })

        })

    });

})()
