const { app, BrowserWindow, ipcMain } = require('electron')
const axios = require('axios');

let appState = {
    productList: [],
    categoryList: [],
    win: undefined,
    token: undefined,
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

    axios.get('http://localhost:8000/api/command')
    .then(function (response) {
      data=response.data.data
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

ipcMain.on('filter-product-by-category', (event, categoryList)=>{
  let filterProduct = []

  console.log(categoryList)

  if (categoryList.length == 0) {
    filterProduct = appState.productList;
  } else {
    appState.productList.forEach( (product) => {
      product.categories.forEach( function (productCategory) {
        categoryList.forEach(function (category) {
          if (productCategory.id == category.id) {
            filterProduct.push(product);
          }
        })
      })
    })
  }

  appState.win.webContents.send("got-product-list", filterProduct);
})

ipcMain.on('setup', (event, data)=>{
  appState.token = data
})

ipcMain.on('login-param', (event, data)=>{

  axios.post('http://localhost:8000/api/login', data)
  .then(function (response) {
    appState.token = response.data.token
    appState.win.webContents.send("user-authentify", appState.token);
  });

})



app.whenReady().then(startApplication)
