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
  console.log(await ssh.exec('ls'));
}
function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
}
