const path = require('path');
const { remote } = require('electron');

module.exports = (opts, manager) => {
  document.getElementById('start-submit').addEventListener('click', async () => {
    const file = document.getElementById('start-fileLocation');
    const name = document.getElementById('start-name');

    let dir = path.resolve(loadKeyFile(document.getElementById('start-dir').value));
    if ((await get('type')) === 'ssh') {
      dir = document.getElementById('start-dir').value;
    }
    await manager.driver.start({
      file: file.value,
      name: name.value,
      dir: dir
    })
    await manager.setPane('main');
  })
}
function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
}
