const fs = require('fs').promises;
const path = require('path');
const sshDriver = require('../drivers/ssh.js');
const {remote} = require('electron');

class PaneManager {
  constructor() {
    this.HTMLcache = {};
    this.cache = undefined;
    this.current = {};
    this.managers = {
      //'create-app': require('./create-app.js'),
      main: require('./main.js'),
      proc: require('./proc.js')
      //options: require('./options.js')
    };
    this.paneElement = document.getElementById('pane');

  }
  async setPane(name, opts = {}) {
    try {
      this.removePane();
      if (!this.HTMLcache[name]) {
        const html = await fs.readFile(path.resolve(__dirname + `/${name}.html`));
        this.HTMLcache[name] = html;
      }
      this.setPaneHTML(this.HTMLcache[name]);

      opts.paneElement = this.paneElement;
      this.managers[name](opts, this)
    } catch (e) {
      console.error(e);
      return alert(`Pane '${name}' failed to load.`);
    }
  }
  removePane() {
    while (this.paneElement.firstChild) {
      this.paneElement.removeChild(this.paneElement.firstChild);
    }
  }
  setPaneHTML(html) {
    this.paneElement.innerHTML = html;
  }
  async loadDriver(type) {
    if (type === 'ssh') {
      this.driver = new sshDriver({dir: 'PM2Monitor/server/'});
      const loginDetails = {
        host: await get('sshHost'),
        username: await get('sshUser'),
        privateKey: path.resolve(loadKeyFile(await get('sshKey'))),
        port: await get('sshPort') || 21
      };
      console.log(loginDetails);
      return await this.driver.connect(loginDetails)
    }
  }
}

function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
}

module.exports = PaneManager;
