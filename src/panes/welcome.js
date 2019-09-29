const path = require('path');
const { remote } = require('electron');
module.exports = (opts, manager) => {
  document.getElementById('sshButton').addEventListener('click', async () => {
    await set('type', 'ssh');
    await set('sshHost', document.getElementById('sshHost').value)
    await set('sshUser', document.getElementById('sshUser').value)
    await set('sshKey', path.resolve(loadKeyFile(document.getElementById('sshKey').value)));
    await set('sshPort', document.getElementById('sshPort').value || 22);
    await set('remoteDir', document.getElementById('remoteDir').value || '~/.pm2monitor/server')
    try {
      await manager.loadDriver('ssh');
      await manager.driver.load();
      await manager.driver.list();
    } catch (e) {
      return alert('Failed to connect');
    }
    await manager.loadSidePane();
    await manager.setPane('main');
  })
  document.getElementById('localButton').addEventListener('click', async () => {
    await set('type', 'local');

    try {
      await manager.loadDriver('local');
    } catch (e) {
      return alert('Failed to connect');
    }
    await manager.loadSidePane();
    await manager.setPane('main');
  })
}
function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
}
