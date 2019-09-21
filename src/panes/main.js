const storage = require('electron-json-storage');
const path = require('path');
const { remote } = require('electron');

module.exports = async (opts, manager) => {
  if (manager.cache) {
    createProcList(manager, manager.cache)
  }
  const apps = await manager.driver.list();
  manager.cache = apps;
  removeLoadingText(manager)
  createProcList(manager, apps)
}
function removeLoadingText(manager) {
  const loadingText = document.getElementById('loadingText');
  manager.paneElement.removeChild(loadingText);
}
function removeChildren(el) {
  while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
}
function createProcList(manager, apps) {
  const list = document.getElementById('procList');
  removeChildren(list);
  for (var i = 0; i < apps.length; i++) {
    const app = apps[i];
    const divContainer = document.createElement('div');
    divContainer.classList.add('app');
    const h3Title = document.createElement('h3');
    const h3TitleText = document.createTextNode(app.pm_id + ': ' + app.name);
    const statusText = document.createTextNode(app.pm2_env.status);
    h3Title.appendChild(h3TitleText);
    divContainer.appendChild(h3Title);
    divContainer.appendChild(statusText);

    createButton(divContainer, 'Stop', async (ev) => {
      ev.target.disabled = true;
      await manager.driver.procCommand('stop', app.pm_id)
      const list = await manager.driver.list();
      createProcList(manager, list)
    })
    createButton(divContainer, 'Restart / Start', async (ev) => {
      ev.target.disabled = true;
      await manager.driver.procCommand('restart', app.pm_id)
      const list = await manager.driver.list();
      createProcList(manager, list)
    })
    createButton(divContainer, 'Open', async (ev) => {
      ev.target.disabled = true;
      await manager.setPane('proc', {id: app.pm_id, name: app.name});
    })

    list.appendChild(divContainer);
  }
}
function createButton(top, text, fn) {
  const button = document.createElement('button');
  const buttonText = document.createTextNode(text);

  button.addEventListener('click', fn);
  button.appendChild(buttonText)
  top.appendChild(button)
}
