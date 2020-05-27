const { app, BrowserWindow, ipcMain } = require('electron')
const axios = require('axios');
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

let appState = {
    productList: [],
    categoryList: [],
    win: undefined,
    token: undefined,
    user : [],
    cart : {
      product : [],
    },
}

function createWindow () {
  // Cree la fenetre du navigateur.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.webContents.openDevTools()
  // and load the index.html of the app.
  win.loadFile('index.html')
  return win
}


function startApplication() {
  appState.win = createWindow();

  appState.win.webContents.on('did-finish-load', ()=>{
    axios.get('http://localhost:8000/api/product')
    .then(function (response) {
      data=response.data.data
      appState.productList = data
      appState.win.webContents.send(systemEvents.EVENT_FETCHED_PRODUCTS, appState.productList);
    });

    axios.get('http://localhost:8000/api/command', {params:{ token: appState.token}})
    .then(function (response) {
      data=response.data.command
      appState.win.webContents.send(systemEvents.EVENT_FETCHED_COMMANDS, data);
    });

    axios.get('http://localhost:8000/api/category')
    .then(function (response) {
      data=response.data.data
      appState.categoryList = data
      appState.win.webContents.send(systemEvents.EVENT_FETCHED_CATEGORIES, appState.categoryList);
    });

  })

}

ipcMain.on(displayEvents.EVENT_PRODUCT_ADDED_TO_CART, (event, product)=>{

  appState.cart.product.push(product)
  appState.win.webContents.send(systemEvents.EVENT_CART_UPDATED, appState.cart);
})

function findIndex(list, obj) {

  for (var i=0; i<list.length; i++) {
    if ( list[i].id == obj.id ) {
      return i;
    }
  }

}

ipcMain.on('remove-product-cart', (event, product)=>{

  appState.cart.product.splice(findIndex(appState.cart.product ,product), 1);

  appState.win.webContents.send(systemEvents.EVENT_CART_UPDATED, appState.cart);
})

ipcMain.on(displayEvents.EVENT_INIT_CART, (event, cart)=>{
  appState.cart = cart
})


ipcMain.on(displayEvents.EVENT_PRODUCT_FILTERED_BY_CATEGORY, (event, categoryList)=>{
  let filterProduct = []

  if (categoryList.length == 0) {
    filterProduct = appState.productList;
  } else {
    appState.productList.forEach( (product) => {
      product.categories.forEach( function (productCategory) {
        categoryList.forEach(function (category) {
          if (productCategory.id == category.id && filterProduct.indexOf(product) == -1) {
            filterProduct.push(product);
          }
        })
      })
    })
  }

  appState.win.webContents.send(systemEvents.EVENT_FETCHED_PRODUCTS, filterProduct);
})

ipcMain.on(displayEvents.EVENT_SETUP, (event, data)=>{
  appState.token = data.token
  appState.user = data.user

})

ipcMain.on('login-param', (event, data)=>{

  axios.post('http://localhost:8000/api/login', data)
  .then(function (response) {

    if (response.data.success) {
      appState.user = response.data.user
      appState.token = response.data.token

      appState.win.webContents.send(systemEvents.EVENT_USER_AUTHENTIFY, {user:appState.user, token: appState.token});
    } else {
      appState.win.webContents.send(systemEvents.EVENT_UPDATE_AUTHENTIFY);
    }
  });

})

ipcMain.on('register-param', (event, data)=>{

  axios.get('http://localhost:8000/api/register', {params: data})
  .then(function (response) {
    console.log(response.data)
    if (response.data.success) {


      appState.win.webContents.send(systemEvents.EVENT_USER_REGISTER);
    } else {

    }
  });

})

ipcMain.on('confirmer-command', (event, data)=>{

  axios.post('http://localhost:8000/api/confirmer-command', data)
  .then(function (response) {
   console.log(response.data)
    if (response.data.success) {
      let check = response.data.success

    } else {
    }
  });

})


ipcMain.on('contact-param', (event, data)=>{

  axios.post('http://localhost:8000/api/contact', data)
  .then(function (response) {
   console.log(response.data)
    if (response.data.success) {
      let check = response.data.success

    } else {

    }
  });

})

ipcMain.on('send-cart', (event, data) =>{
  data.token = appState.token
  axios.post('http://localhost:8000/api/validate-command', data)
  .then(function (response) {
    console.log(response)
    appState.cart = { product : [] }
    appState.win.webContents.send(systemEvents.EVENT_CART_UPDATED, appState.cart);
  });
})


app.whenReady().then(startApplication)
