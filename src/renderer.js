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
      const paneList = document.getElementById('paneList')
      createListButton(paneList, 'Main', () => manager.setPane('main'));
      createListButton(paneList, 'Options', () => manager.setPane('options'));

      if (type) {
        return manager.setPane('main');
      } else {
        return manager.setPane('welcome');
      }
    } catch (e) {
      console.log(e);
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
function createListButton(top, text, fn) {
  const button = document.createElement('button');
  const buttonText = document.createTextNode(text);
  const li = document.createElement('li');
  
  li.appendChild(button);
  button.addEventListener('click', fn);
  button.appendChild(buttonText);
  top.appendChild(li);
}
