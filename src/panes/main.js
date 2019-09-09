const node_ssh = require('node-ssh')
const storage = require('electron-json-storage');
const path = require('path');
const { remote } = require('electron');

module.exports = async (opts, manager) => {
  const ssh = new node_ssh()
  const config = {
    host: await get('sshHost'),
    username: await get('sshUser'),
    privateKey: path.resolve(loadKeyFile(await get('sshKey'))),
    port: await get('sshPort')
  }
  console.log(config)
  await ssh.connect(config)
  const apps = await getList(ssh)
  removeLoadingText(manager)
  createProcList(manager, apps, ssh)
}
function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
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
async function getList(ssh) {
  const input = await ssh.execCommand('cd PM2Monitor/server/; node server-connector.js -t list');
  console.log(input);
  const apps = JSON.parse(input.stdout)
  console.log(apps)
  return apps;
}
function createProcList(manager, apps, ssh) {
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
      console.log(await ssh.execCommand('cd PM2Monitor/server/; node server-connector.js -t stop --id ' + app.pm_id));
      const list = await getList(ssh);
      createProcList(manager, list, ssh)
    })
    createButton(divContainer, 'Restart / Start', async (ev) => {
      ev.target.disabled = true;
      console.log(await ssh.execCommand('cd PM2Monitor/server/; node server-connector.js -t restart --id ' + app.pm_id));
      const list = await getList(ssh);
      createProcList(manager, list, ssh)
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
