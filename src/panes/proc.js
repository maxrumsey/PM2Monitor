const storage = require('electron-json-storage');
const path = require('path');
const { remote } = require('electron');
const pretty = require('prettysize');

module.exports = async (opts, manager) => {
  let info = await manager.driver.describe(opts.id);
  info = info[0];
  const proc = {
    env: info.pm2_env,
    out: await manager.driver.logs('out', info),
    err: await manager.driver.logs('err', info),
    info
  }

  buildLogs(proc);
  buildInfo(proc);

  const buttonsContainer = document.getElementById('buttonsContainer');
  createButton(buttonsContainer, 'Stop', async (ev) => {
    ev.target.disabled = true;
    await manager.driver.procCommand('restart', app.pm_id)
    const list = await manager.driver.list();
    createProcList(manager, list)
  })
  createButton(buttonsContainer, 'Restart / Start', async (ev) => {
    ev.target.disabled = true;
    await manager.driver.procCommand('start', app.pm_id)
    const list = await manager.driver.list();
    createProcList(manager, list)
  })
  createButton(buttonsContainer, 'Delete', async (ev) => {
    ev.target.disabled = true;
    await manager.driver.procCommand('restart', app.pm_id)
    const list = await manager.driver.list();
    createProcList(manager, list)
  })
}
function createButton(top, text, fn) {
  const button = document.createElement('button');
  const buttonText = document.createTextNode(text);

  button.addEventListener('click', fn);
  button.appendChild(buttonText)
  top.appendChild(button)
}
async function buildInfo(proc) {
  const memory = document.getElementById('memory')
  addText(memory, 'Memory Usage: ' + pretty(proc.info.monit.memory));
}
function buildLogs(proc) {
  const env = document.getElementById('logs_env');
  env.appendChild(document.createTextNode(JSON.stringify(proc.env)));
  const out = document.getElementById('logs_out');
  out.appendChild(document.createTextNode(proc.out));
  const err = document.getElementById('logs_err');
  err.appendChild(document.createTextNode(proc.err));
}
function addText(el, text) {
  const node = document.createTextNode(text);
  el.appendChild(node);
}
