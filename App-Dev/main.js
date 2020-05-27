const { app, BrowserWindow, ipcMain } = require('electron')
const axios = require('axios');

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
      appState.win.webContents.send("got-product-list", appState.productList);
    });

    axios.get('http://localhost:8000/api/command', {params:{ token: appState.token}})
    .then(function (response) {
      data=response.data.command
      appState.win.webContents.send("got-command-list", data);
    });

    axios.get('http://localhost:8000/api/category')
    .then(function (response) {
      data=response.data.data
      appState.categoryList = data
      appState.win.webContents.send("got-category-list", appState.categoryList);
    });

  })

}

ipcMain.on('add-product-to-cart', (event, product)=>{

  appState.cart.product.push(product)
  appState.win.webContents.send("update-cart", appState.cart);
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

  appState.win.webContents.send("update-cart", appState.cart);
})

ipcMain.on('init-cart', (event, cart)=>{
  appState.cart = cart
})


ipcMain.on('filter-product-by-category', (event, categoryList)=>{
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

  appState.win.webContents.send("got-product-list", filterProduct);
})

ipcMain.on('setup', (event, data)=>{
  appState.token = data.token
  appState.user = data.user

})

ipcMain.on('login-param', (event, data)=>{

  axios.post('http://localhost:8000/api/login', data)
  .then(function (response) {
//    console.log(response.da)
    if (response.data.success) {
      appState.user = response.data.user
      appState.token = response.data.token

      appState.win.webContents.send("user-authentify", {user:appState.user, token: appState.token});
    } else {
      appState.win.webContents.send("update-authentify");
    }
  });

})

ipcMain.on('confirmer-command', (event, data)=>{

  axios.post('http://localhost:8000/api/confirmer-command', data)
  .then(function (response) {
   console.log(response.data)
    if (response.data.success) {
      let check = response.data.success

    //  appState.win.webContents.send("user-authentify", {success:check});
    } else {
     // appState.win.webContents.send("update-authentify");
    }
  });

})


ipcMain.on('contact-param', (event, data)=>{

  axios.post('http://localhost:8000/api/contact', data)
  .then(function (response) {
   console.log(response.data)
    if (response.data.success) {
      let check = response.data.success

    //  appState.win.webContents.send("user-authentify", {success:check});
    } else {
     // appState.win.webContents.send("update-authentify");
    }
  });

})

ipcMain.on('send-cart', (event, data) =>{
  data.token = appState.token
  axios.post('http://localhost:8000/api/validate-command', data)
  .then(function (response) {
    console.log(response)
    appState.cart = { product : [] }
    appState.win.webContents.send("update-cart", appState.cart);
  });
})


app.whenReady().then(startApplication)
