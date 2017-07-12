const git = require('simple-git')()
const fs = require('fs')
const exec = require('child_process').exec

const remote = 'origin'
const branch = 'staging'
const fileDoesNotExist = 'ENOENT'
const successInitMessage = 'init written successfully'

module.exports = {
  commit: (userDir, message) => new Promise((resolve, reject) => {
    // deletes package.json
    if (fs.existsSync(`${userDir}/package.json`)) {
      fs.unlink(`${userDir}/package.json`, (err) => {
        if (err && err.code !== fileDoesNotExist) {
          reject(err)
        }
      })
    }

    // generates a new package.json based on node_modules
    exec('npm init -y', { cwd: userDir }, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else if (stderr && !stderr.includes(successInitMessage)) {
        reject(stderr)
      } else {
        // commits and pushes all changes to the remote branch
        git.add('--all').commit(message).push(remote, branch, (ex, data) => {
          if (ex) {
            reject(ex)
          } else {
            resolve(data)
          }
        })
      }
    })
  }),

  createLocalRepo: (userDir) => new Promise((resolve, reject) => {
    if (!fs.existsSync(`${userDir}/.git`)) {
      git.init((err) => {
        console.log(err)
      })
    }
  }),
  sendFile: (res, filename) => {
    // Use the right function depending on Express 3.x/4.x
    if (res.sendFile) {
      res.sendFile(filename)
    } else {
      res.sendfile(filename)
    }
  },

  tags: () => new Promise((resolve, reject) => {
    git.tags({}, (err, tags) => {
      if (err) {
        reject(err)
      } else {
        resolve(tags)
      }
    })
  }),

  logs: branchName => new Promise((resolve, reject) => {
    git.log([branchName], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  branches: () => new Promise((resolve, reject) => {
    git.branch(['-vv'], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  checkout: branchName => new Promise((resolve, reject) => {
    git.checkout(branchName, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  show: (hash, fileName) => new Promise((resolve, reject) => {
    git.show([`${hash}:${fileName}`], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  status: () => new Promise((resolve, reject) => {
    git.status((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  cwd: dir => new Promise((resolve, reject) => {
    try {
      git.cwd(dir)
      resolve(dir)
    } catch (e) {
      reject(e)
    }
  }),

  remoteGet: () => new Promise((resolve, reject) => {
    git.getRemotes(true, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result[0].refs.push)
      }
    })
  }),

  remoteSet: url => new Promise((resolve, reject) => {
    git.raw(['remote', 'set-url', remote, url], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(url)
      }
    })
  }),

  fetch: () => new Promise((resolve, reject) => {
    git.fetch(['--all'], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  }),

  update: (branchName, force, userDir) => new Promise((resolve, reject) => {
    git.branch(['-vv'], (err, branches) => {
      if (err) {
        reject(err)
      }
      // if the branch does not exist on remote, create an empty commit and push the branch to remote
      // const branches = this.branches()
      if (!branches.branches) {
        git.checkoutBranch(branchName, userDir, (err) => {
          if (err) {
            reject(err)
          }
        }).commit('first commit', null, { '--allow-empty': true }, (err) => {
          if (err) {
            reject(err)
          }
        }).push(remote, branchName, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        // if the branch exists, update the local repo
        if (force) {
          // discards all local changes
          git.reset(['--hard', `${remote}/${branchName}`], (err) => {
            if (err) {
              reject(err)
            }
          }).clean('f', (err) => {
            if (err) {
              reject(err)
            }
          })
        }
        git.pull((err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}
