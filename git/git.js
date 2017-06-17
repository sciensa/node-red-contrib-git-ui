const path = require('path');
const gitUi = require('./git-ui/git-ui');

module.exports = (RED) => {
  function gitUiNode(config) {
    RED.nodes.createNode(this, config);
  }
  RED.nodes.registerType('git-ui', gitUiNode);

  RED.httpAdmin.get('/git-ui/node_modules/bootstrap/dist/js/bootstrap.min.js', (req, res) => {
    const filename = path.join(__dirname, '../node_modules/bootstrap/dist/js/', 'bootstrap.min.js');
    gitUi.sendFile(res, filename);
  });

  RED.httpAdmin.get('/git-ui/node_modules/bootstrap/dist/css/bootstrap.min.css', (req, res) => {
    const filename = path.join(__dirname, '../node_modules/bootstrap/dist/css/', 'bootstrap.min.css');
    gitUi.sendFile(res, filename);
  });

  RED.httpAdmin.get('/git-ui/git-ui.html', (req, res) => {
    const filename = path.join(__dirname, 'git-ui', 'git-ui.html');
    gitUi.sendFile(res, filename);
  });

  RED.httpAdmin.post('/git-ui/commit', (req, res) => {
    gitUi.commit(req.body.message, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({ status: 'OK' });
      }
    });
  });
};
