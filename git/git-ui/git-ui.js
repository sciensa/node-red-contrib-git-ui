const git = require('simple-git')();
const fs = require('fs');
const init = require('init-package-json');

const remote = 'origin';
const branch = 'staging';

module.exports = {
  commit: (userDir, message) => new Promise((resolve, reject) => {
    // deletes package.json
    fs.unlink(`${userDir}/package.json`, (err) => {
      if (err) {
        reject(err);
      } else {
        // generates a new package.json based on node_modules
        init(userDir, userDir, { yes: 'yes' }, (er) => {
          if (er) {
            reject(er);
          } else {
            // commits and pushes all changes to the remote branch
            git.add('--all').commit(message).push(remote, branch, (ex, data) => {
              if (ex) {
                reject(ex);
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
    git.tags({}, (err, tags) => {
      if (err) {
        reject(err);
      } else {
        resolve(tags);
      }
    });
  }),

  logs: branchName => new Promise((resolve, reject) => {
    git.log([branchName], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

  branches: () => new Promise((resolve, reject) => {
    git.branch(['-vv'], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

  checkout: branchName => new Promise((resolve, reject) => {
    git.checkout(branchName, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

  show: (hash, fileName) => new Promise((resolve, reject) => {
    git.show([`${hash}:${fileName}`], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

  status: () => new Promise((resolve, reject) => {
    git.status((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

  cwd: dir => new Promise((resolve, reject) => {
    try {
      git.cwd(dir);
      resolve(dir);
    } catch (e) {
      reject(e);
    }
  }),
};
