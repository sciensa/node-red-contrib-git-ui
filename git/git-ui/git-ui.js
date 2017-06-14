const git = require('simple-git');
const fs = require('fs');
const exec = require('child_process').exec;

const remote = 'origin';
const branch = 'staging';

module.exports = {
  commit: (message, callback) => {
      // deletes package.json
    fs.unlink('./package.json', (err) => {
      if (err) {
        callback(err, null);
      } else {
        // generates a new package.json based on node_modules
        exec('npm init -y', (er, stdout, stderr) => {
          if (er) {
            callback(er, null);
          } else if (stderr) {
            callback(stderr, null);
          } else {
              // commits and pushes all changes to the remote branch
            git().add('--all').commit(message).push(remote, branch, (e, data) => {
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
  },

  sendFile: (res, filename) => {
    // Use the right function depending on Express 3.x/4.x
    if (res.sendFile) {
      res.sendFile(filename);
    } else {
      res.sendfile(filename);
    }
  },
};
