const storage = require('electron-json-storage');
const path = require('path');
const { remote } = require('electron');
const pretty = require('prettysize');

module.exports = async (opts, manager) => {
  console.log(opts.name)
  const proc = await getInfo(manager, opts);

  buildLogs(proc);
  buildInfo(proc);

  addText(document.getElementById('procName'), opts.name);

  const buttonsContainer = document.getElementById('buttonsContainer');
  createButton(buttonsContainer, 'Stop', async (ev) => {
    ev.target.disabled = true;
    await manager.driver.procCommand('restart', opts.id)
    manager.setPane('proc', opts);
  })
  createButton(buttonsContainer, 'Restart / Start', async (ev) => {
    ev.target.disabled = true;
    await manager.driver.procCommand('start', opts.id)
    manager.setPane('proc', opts);
  })
  createButton(buttonsContainer, 'Delete', async (ev) => {
    ev.target.disabled = true;
    await manager.driver.procCommand('delete', opts.id)
    await manager.setPane('main')
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

  const cpu = document.getElementById('cpu')
  addText(cpu, 'CPU Usage: ' + proc.info.monit.cpu + '%');
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
async function getInfo(manager, opts) {
  let info = await manager.driver.describe(opts.id);
  info = info[0];
  const proc = {
    env: info.pm2_env,
    out: await manager.driver.logs('out', info, 100),
    err: await manager.driver.logs('err', info, 100),
    info
  }
  return proc;
}
