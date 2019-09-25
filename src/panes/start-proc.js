module.exports = (opts, manager) => {
  document.getElementById('start-submit').addEventListener('click', async () => {
    const file = document.getElementById('start-fileLocation');
    const name = document.getElementById('start-name');
    const dir = document.getElementById('start-dir');

    await manager.driver.start({
      file,
      name,
      dir
    })
    await manager.setPane('main');
  })
}
