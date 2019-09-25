const fs = require('fs').promises;
const path = require('path');
const sshDriver = require('../drivers/ssh.js');
const localDriver = require('../drivers/local.js');
const { remote } = require('electron');

class PaneManager {
  constructor() {
    this.HTMLcache = {};
    this.cache = undefined;
    this.procCache = {};
    this.current = {};
    this.managers = {
      //'create-app': require('./create-app.js'),
      main: require('./main.js'),
      proc: require('./proc.js'),
      welcome: require('./welcome.js'),
      options: require('./options.js'),
      "start-proc": require('./start-proc.js')
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
    } else if (type === 'local') {
      this.driver = new localDriver();
      return await this.driver.connect()
    } else {
      throw new Error('Unknown Driver Type')
    }
  }
  loadSidePane() {
    const paneList = document.getElementById('paneList')
    createListButton(paneList, 'Main', () => this.setPane('main'));
    createListButton(paneList, 'Options', () => this.setPane('options'));
    createListButton(paneList, 'Start', () => this.setPane('start-proc'));

  }
}

function loadKeyFile(val) {
  val = val.replace('~', remote.app.getPath('home'));
  return val;
}
function createListButton(top, text, fn) {
  const button = document.createElement('button');
  const buttonText = document.createTextNode(text);
  const li = document.createElement('li');
  button.type = 'button';
  button.classList.add('btn')
  button.classList.add('btn-light')
  li.appendChild(button);
  button.addEventListener('click', fn);
  button.appendChild(buttonText);
  top.appendChild(li);
}
module.exports = PaneManager;
