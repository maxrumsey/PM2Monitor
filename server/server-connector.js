const pm2 = require('pm2');
const argv = require('minimist')(process.argv.slice(2));

pm2.connect(function(err) {
  if (err) {
    console.error('E: ' + err);
    process.exit(2);
  }
  switch (argv.t) {
    case 'list':
      pm2.list((e, r) => {
        if (e) {
          console.error('E: ' + e);
          process.exit(2)
        }
        console.log(r);
        process.exit(0)
      })
      break;
    default:
      console.log('E: Unknown');
      process.exit(2)
  }

});
