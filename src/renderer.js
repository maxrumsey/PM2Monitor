// Requiring Dependencies
const { ipcRenderer } = require('electron');
const PaneManager = require('./panes/index.js');
const storage = require('electron-json-storage');

global.exit = function () {
  ipcRenderer.send('quit');
}
const manager = new PaneManager();

storage.has('type', (e, inited) => {
  if (e) {
    console.error(e);
    alert(e);
  } else {
    if (inited) {
      manager.setPane('main');
    } else {
      manager.setPane('welcome');
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
