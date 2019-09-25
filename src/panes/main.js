const storage = require('electron-json-storage');
const path = require('path');
const { remote } = require('electron');

module.exports = async (opts, manager) => {
  if (manager.cache) {
    createProcList(manager, manager.cache)
    removeLoadingText(manager)
  }
  const apps = await manager.driver.list();
  manager.cache = apps;
  removeLoadingText(manager)
  createProcList(manager, apps)
}
function removeLoadingText(manager) {
  const loadingText = document.getElementById('loading');
  try {
    manager.paneElement.removeChild(loadingText);
  } catch (e) {

  }
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
    const infoBox = document.createElement('p')
    const h3TitleText = document.createTextNode(app.pm_id + ': ' + app.name);
    const statusText = document.createTextNode('Status: ' + app.pm2_env.status);

    infoBox.appendChild(statusText)
    h3Title.appendChild(h3TitleText);
    divContainer.appendChild(h3Title);
    divContainer.appendChild(infoBox);

    createButton(divContainer, 'Stop', async (ev) => {
      ev.target.disabled = true;
      await manager.driver.procCommand('stop', app.pm_id)
      const list = await manager.driver.list();
      createProcList(manager, list)
    }, 'warning')
    createButton(divContainer, 'Restart / Start', async (ev) => {
      ev.target.disabled = true;
      await manager.driver.procCommand('restart', app.pm_id)
      const list = await manager.driver.list();
      createProcList(manager, list)
    }, 'success')
    createButton(divContainer, 'Open', async (ev) => {
      ev.target.disabled = true;
      await manager.setPane('proc', {id: app.pm_id, name: app.name});
    }, 'primary')

    list.appendChild(divContainer);
  }
}
function createButton(top, text, fn, type='primary') {
  const button = document.createElement('button');
  const buttonText = document.createTextNode(text);

  button.classList.add('btn');
  button.classList.add('btn-' + type);
  button.classList.add('cmd-button');

  button.addEventListener('click', fn);
  button.appendChild(buttonText)
  top.appendChild(button)
}
