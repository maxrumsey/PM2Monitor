const fs = require('fs').promises;
const path = require('path');

class PaneManager {
  constructor(ftp) {
    this.cache = {};
    this.current = {};
    this.managers = {
      //'create-app': require('./create-app.js'),
      main: require('./main.js')
      //options: require('./options.js')
    };
    this.paneElement = document.getElementById('pane');

  }
  async setPane(name, opts = {}) {
    try {
      this.removePane();
      if (!this.cache[name]) {
        const html = await fs.readFile(path.resolve(__dirname + `/${name}.html`));
        this.cache[name] = html;
      }
      this.setPaneHTML(this.cache[name]);

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
}

module.exports = PaneManager;
