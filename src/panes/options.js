const path = require('path');
const { remote } = require('electron');

module.exports = async (opts, manager) => {
  document.getElementById('sshButton').addEventListener('click', async () => {
    await set('type', 'ssh');
    await set('sshHost', document.getElementById('sshHost').value)
    await set('sshUser', document.getElementById('sshUser').value)
    await set('sshKey', path.resolve(loadKeyFile(document.getElementById('sshKey').value)));
    await set('sshPort', document.getElementById('sshPort').value || 22);
    await set('remoteDir', document.getElementById('remoteDir').value)

    try {
      await manager.loadDriver('ssh');
      setStatus('Connection Established')
    } catch (e) {
      setStatus('Failed to connect')
      return alert('Failed to connect');
    }
  })
  document.getElementById('localButton').addEventListener('click', async () => {
    await set('type', 'local');

    try {
      await manager.loadDriver('local');
      setStatus('Connection Established')
    } catch (e) {
      setStatus('Failed to connect')
      return alert('Failed to connect');
    }
  })
  if ((await get('type')) === 'ssh') {
    await setSSHForm();
  }
}
function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
}
function setStatus(text) {
  const status = document.getElementById('status');
  while (status.firstChild) {
    status.removeChild(status.firstChild);
  }
  const textNode = document.createTextNode(text);
  status.appendChild(textNode);
}
async function setSSHForm() {
  document.getElementById('sshHost').value = await get('sshHost')
  document.getElementById('sshUser').value = await get('sshUser')
  document.getElementById('sshKey').value = await get('sshKey')
  document.getElementById('remoteDir').value = await get('remoteDir')
  document.getElementById('sshPort').value = await get('sshPort') || 21;
}
