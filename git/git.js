const path = require('path');
const gitUi = require('./git-ui/git-ui');

module.exports = (RED) => {
  function gitUiNode(config) {
    RED.nodes.createNode(this, config);
  }
  RED.nodes.registerType('git-ui', gitUiNode);

  RED.httpAdmin.get('/git-ui/git-ui.html', (req, res) => {
    const filename = path.join(__dirname, 'git-ui', 'git-ui.html');
    gitUi.sendFile(res, filename);
  });

  RED.httpAdmin.post('/git-ui/commit', (req, res) => {
    gitUi.commit(req.body.message).then((result) => {
      res.status(200).send({ status: 'OK', result });
    }).catch((err) => {
      res.status(500).send(err);
    });
  });

  RED.httpAdmin.get('/git-ui/git-ui.css', (req, res) => {
    const filename = path.join(__dirname, 'git-ui', 'git-ui.css');
    gitUi.sendFile(res, filename);
  });

  RED.httpAdmin.get('/git-ui/logs/:branchName', (req, res) => {
    gitUi.logs(req.params.branchName).then((logList) => {
      res.status(200).send({ commits: logList.all });
    }).catch((err) => {
      res.status(500).send({ error: err });
    });
  });

  RED.httpAdmin.get('/git-ui/branches', (req, res) => {
    gitUi.branches().then((branchList) => {
      res.status(200).send({ branches: branchList.all, current: branchList.current });
    }).catch((err) => {
      res.status(500).send({ error: err });
    });
  });

  RED.httpAdmin.put('/git-ui/checkout/:branchName', (req, res) => {
    const home = RED.settings.userDir || RED.rocess.env.NODE_RED_HOME;
    gitUi.cwd(home).then(() => {
      gitUi.checkout(req.params.branchName).then(() => {
        res.status(200).send({ status: 'OK' });
      }).catch((err) => {
        res.status(500).send({ error: err });
      });
    }).catch((err) => {
      res.status(500).send({ error: err });
    });
  });

  RED.httpAdmin.get('/git-ui/show/:hash/:fileName', (req, res) => {
    gitUi.show(req.params.hash, req.params.fileName).then((object) => {
      res.status(200).send({ object });
    }).catch((err) => {
      res.status(500).send({ error: err });
    });
  });

  RED.httpAdmin.get('/git-ui/status', (req, res) => {
    gitUi.status().then((statusSummary) => {
      res.status(200).send({ statusSummary });
    }).catch((err) => {
      res.status(500).send({ error: err });
    });
  });
};
