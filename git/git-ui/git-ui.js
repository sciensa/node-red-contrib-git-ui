const git = require('simple-git');
const fs = require('fs');
const exec = require('child_process').exec;

const remote = 'origin';
const branch = 'staging';

module.exports = {
  commit: message => new Promise((resolve, reject) => {
    // deletes package.json
    fs.unlink('./package.json', (err) => {
      if (err) {
        reject(err);
      } else {
        // generates a new package.json based on node_modules
        exec('npm init -y', (er, stdout, stderr) => {
          if (er) {
            reject(er);
          } else if (stderr) {
            reject(stderr);
          } else {
            // commits and pushes all changes to the remote branch
            git().add('--all').commit(message).push(remote, branch, (e, data) => {
              if (e) {
                reject(stderr);
              } else {
                resolve(data);
              }
            });
          }
        });
      }
    });
  }),

  sendFile: (res, filename) => {
    // Use the right function depending on Express 3.x/4.x
    if (res.sendFile) {
      res.sendFile(filename);
    } else {
      res.sendfile(filename);
    }
  },

  tags: () => new Promise((resolve, reject) => {
    git().tags({}, (err, tags) => {
      if (err) {
        reject(err);
      } else {
        resolve(tags);
      }
    });
  }),

  logs: () => new Promise((resolve, reject) => {
    git().log({}, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

  branches: () => new Promise((resolve, reject) => {
    git().branch(['-vv'], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

  checkout: branchName => new Promise((resolve, reject) => {
    git().checkout(branchName, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
};
