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
  const input = await ssh.execCommand('cd PM2Monitor/server/; node server-connector.js -t list');
  const apps = JSON.parse(input.stdout)
  console.log(apps)
  removeLoadingText(manager)
  createProcList(manager.paneElement, apps)
}
function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
}
function removeLoadingText(manager) {
  const loadingText = document.getElementById('loadingText');
  manager.paneElement.removeChild(loadingText);
}
function createProcList(element, apps) {
  for (var i = 0; i < apps.length; i++) {
    const app = apps[i];
    const divContainer = document.createElement('div');
    divContainer.classList.add('app');
    const h3Title = document.createElement('h3');
    const cycleButton = document.createElement('button');
    const cycleButtonText = document.createTextNode('Cycle Status');

    cycleButton.addEventListener('click', function() {
      console.log('Cycling Proc ID: ' + app.pm_id)
    })
    
    const h3TitleText = document.createTextNode(app.pm_id + ': ' + app.name);
    const statusText = document.createTextNode(app.pm2_env.status);
    h3Title.appendChild(h3TitleText);
    divContainer.appendChild(h3Title);
    divContainer.appendChild(statusText);
    cycleButton.appendChild(cycleButtonText);
    divContainer.appendChild(cycleButton);
    element.appendChild(divContainer);
  }
}
