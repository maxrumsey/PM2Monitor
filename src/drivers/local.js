const pm2 = require('pm2');
const fs = require('fs').promises;
class Driver {
  constructor(opts) {
    this.pm2 = pm2;
    this.opts = opts;
  }
  connect() {
    return new Promise((res, rej) => {
      this.pm2.connect(e => {
        if (e) {
          rej(e);
        } else {
          res(this);
        }
      })
    })
  }
  list() {
    return new Promise((res, rej) => {
      this.pm2.list((e, r) => {
        if (e) {
          rej(e);
        } else {
          res(r);
        }
      })
    })
  }
  procCommand(type, id) {
    return new Promise((res, rej) => {
      this.pm2[type](id, (e, r) => {
        if (e) {
          rej(e);
        } else {
          res(r);
        }
      })
    })
  }
  describe(id) {
    return new Promise((res, rej) => {
      this.pm2.describe(id, (e, r) => {
        if (e) {
          rej(e);
        } else {
          res(r);
        }
      })
    })
  }
  async logs(type, env, lines) {
    const file = env.pm2_env[`pm_${type}_log_path`]
    const buffer = await fs.readFile(file);
    const str = buffer.toString('utf8').split('\n');
    let len = str.length - 100;
    if (len < 0) len = 0;
    return str.slice(len).join('\n');
  }
  start(opts) {
    return new Promise((res, rej) => {
      this.pm2.start({
      name: opts.name,
      cwd: opts.dir,
      script: opts.file
    }, (e, r) => {
        if (e) {
          rej(e);
        } else {
          res(r);
        }
      })
    })
  }
}

module.exports = Driver;
