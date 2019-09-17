const path = require('path');
const { remote } = require('electron');

module.exports = (opts, manager) => {
  document.getElementById('sshButton').addEventListener('click', async () => {
    await set('type', 'ssh');
    await set('sshHost', document.getElementById('sshHost').value)
    await set('sshUser', document.getElementById('sshUser').value)
    await set('sshKey', path.resolve(loadKeyFile(document.getElementById('sshKey').value)));
    await set('sshPort', document.getElementById('sshPort').value || 21);

    try {
      await manager.loadDriver('ssh');
      setStatus('Connection Established')
    } catch (e) {
      setStatus('Failed to connect')
      return alert('Failed to connect');
    }
  })
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
