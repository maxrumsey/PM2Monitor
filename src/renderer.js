// Requiring Dependencies
const { ipcRenderer } = require('electron');
const PaneManager = require('./panes/index.js');
const storage = require('electron-json-storage');

global.exit = function () {
  ipcRenderer.send('quit');
}
const manager = new PaneManager();

storage.get('type', async (e, type) => {
  if (e) {
    console.error(e);
    alert(e);
  } else {
    try {
      await manager.loadDriver(type);
      const loadingElement = document.getElementById('loading');
      loadingElement.parentElement.removeChild(loadingElement);
      if (type) {
        manager.loadSidePane();
        return manager.setPane('main');
      } else {
        return manager.setPane('welcome');
      }
    } catch (e) {
      console.log(e);
      const loadingElement = document.getElementById('loading');
      loadingElement.parentElement.removeChild(loadingElement);
      return manager.setPane('welcome');
    }
  }
})
global.set = (a, b) => {
  return new Promise((res, rej) => {
    storage.set(a, b, (e) => {
      if (e) return rej(e);
      res();
    });
  })
}
global.get = a => {
  return new Promise((res, rej) => {
    return storage.get(a, (e, key) => {
      if (e) return rej(e);
      res(key);
    });
  })
}
