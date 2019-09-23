const node_ssh = require('node-ssh')

class Driver {
  constructor(opts) {
    this.ssh = new node_ssh();
    this.opts = opts;
  }
  async connect(details) {
    await this.ssh.connect(details);
    return this;
  }
  async list() {
    let input = await this._execute(this._format('-t list'));
    const apps = JSON.parse(input.stdout);
    console.log(apps);
    return apps;
  }
  _format(opts) {
    return `cd ${this.opts.dir}; node server-connector.js ${opts}`;
  }
  async procCommand(type, id) {
    await this._execute(this._format(`-t ${type} --id ${id}`));
  }
  async _execute(cmd) {
    let output;
    try {
      output = await this.ssh.execCommand(cmd);
      if (output.stderr) {
        throw new Error(output.stderr);
      }
    } catch (e) {
      console.error(e);
      alert('SSH Error: ' + e);
    }
    return output;
  }
  async describe(id) {
    const input = await this._execute(this._format(`-t describe --id ${id}`));
    return JSON.parse(input.stdout);
  }
  async logs(type, env, lines) {
    const logs = await this._execute('tail ' + ` -n ${lines} ` + env.pm2_env[`pm_${type}_log_path`]);
    return logs.stdout;
  }
  async start(opts) {
    const values = Object.values(opts);
    let opts = '';
    for (var i = 0; i < values.length; i++) {
      opts += `--${values[i][0]} ${values[i][1]} `;
    }
    console.log(this._format(opts));
    return await this._execute(this._format(opts));
  }
}

module.exports = Driver;
