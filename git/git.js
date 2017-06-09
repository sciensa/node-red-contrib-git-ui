const path = require('path');
const git = require('simple-git');
const fs = require('fs');
const exec = require('child_process').exec;

module.exports = (RED) => {
  function gitNode(n) {
    RED.nodes.createNode(this, n);
  }
  RED.nodes.registerType('git', gitNode);

  function commit(message, callback) {
    // deletes package.json and generates a new one based on node_modules
    fs.unlink('./package.json', (err) => {
      if (err) {
        callback(err, null);
      } else {
        exec('npm init -y', (er, stdout, stderr) => {
          if (er) {
            callback(er, null);
          } else if (stderr) {
            callback(stderr, null);
          } else {
            // commits all changes and pushes them to the remote branch
            git().add('--all').commit(message).push('origin', 'staging', (e, data) => {
              if (e) {
                callback(e, data);
              } else {
                callback(null, data);
              }
            });
          }
        });
      }
    });
  }

  function sendFile(res, filename) {
    // Use the right function depending on Express 3.x/4.x
    if (res.sendFile) {
      res.sendFile(filename);
    } else {
      res.sendfile(filename);
    }
  }

  RED.httpAdmin.get('/git-ui/git-ui.html', (req, res) => {
    const filename = path.join(__dirname, 'git-ui', 'git-ui.html');
    sendFile(res, filename);
  });

  RED.httpAdmin.post('/git-ui/commit', (req, res) => {
    commit(req.body.comment, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({ status: 'OK' });
      }
    });
  });
};
