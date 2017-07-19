const fs = require('fs')
const exec = require('child_process').exec

const remote = 'origin'
const branch = 'staging'
const fileDoesNotExist = 'ENOENT'
const successInitMessage = 'init written successfully'

module.exports = {
  commit: (userDir, message) => new Promise((resolve, reject) => {
    // deconstes package.json
    if (fs.existsSync(`${userDir}/package.json`)) {
      fs.unlink(`${userDir}/package.json`, (err) => {
        if (err && err.code !== fileDoesNotExist) {
          reject(err)
        }
      })
    }

    // generates a new package.json based on node_modules in order to keep installed nodes
    exec('npm init -y', { cwd: userDir }, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else if (stderr && !stderr.includes(successInitMessage)) {
        reject(stderr)
      } else {
        // commits and pushes all changes to the remote branch
        require('simple-git')(userDir).add('--all').commit(message).push(remote, branch, (ex, data) => {
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
      require('simple-git')(userDir).init()
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

  tags: (userDir) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).tags({}, (err, tags) => {
      if (err) {
        reject(err)
      } else {
        resolve(tags)
      }
    })
  }),

  logs: (userDir, branchName) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).log([branchName], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  branches: (userDir) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).branch(['-vv'], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  checkout: (userDir, branchName) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).checkout(branchName, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  show: (userDir, hash, fileName) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).show([`${hash}:${fileName}`], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  status: (userDir) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).status((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),

  cwd: userDir => new Promise((resolve, reject) => {
    try {
      require('simple-git')(userDir).cwd(userDir)
      resolve(userDir)
    } catch (e) {
      reject(e)
    }
  }),

  remoteGet: (userDir) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).getRemotes(true, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result[0].refs.push)
      }
    })
  }),

  remoteSet: (userDir, url) => new Promise((resolve, reject) => {
    const git = require('simple-git')(userDir)
    git.getRemotes(true, (err, result) => {
      if (err) {
        reject(err)
      } else {
        if (!result.filter((r) => { return r.name === 'origin' })[0]) {
          git.raw(['remote', 'add', remote, url], (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(url)
            }
          })
        } else {
          git.raw(['remote', 'set-url', remote, url], (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(url)
            }
          })
        }
      }
    })
  }),

  fetch: (userDir) => new Promise((resolve, reject) => {
    require('simple-git')(userDir).fetch(['--all'], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  }),

  update: (userDir, branchName, force) => new Promise((resolve, reject) => {
    const git = require('simple-git')(userDir)
    git.fetch(['--all']).raw(['branch', '-r'], (err, result) => {
      if (err) {
        reject(err)
      } else {
        // if the branch does not exist on remote, create an empty commit and push the branch to remote
        if (!result || !result.split('\n').filter((b) => { return b.substring(b.indexOf('/') + 1) === branchName })[0]) {
          git.checkoutLocalBranch(branchName, (err) => {
            if (err) {
              reject(err)
            } else {
              git.commit('first commit', null, { '--allow-empty': true }, (err) => {
                if (err) {
                  reject(err)
                } else {
                  git.push(remote, branchName, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      git.raw(['branch', '-u', `${remote}/${branchName}`], (err) => {
                        if (err) {
                          reject(err)
                        } else {
                          resolve()
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          git.status((err, statusSummary) => {
            if (err) {
              reject(err)
            } else {
              // if the branch exists, update the local repo
              if (force) {
                // discards all local changes
                git.reset(['--hard', `${remote}/${branch}`], (err) => {
                  if (err) {
                    reject(err)
                  }
                }).raw(['clean', '-d', '-f'], (err) => {
                  if (err) {
                    reject(err)
                  }
                })
              }
              // if not on branch staging, checks out origin/staging
              if (statusSummary.tracking !== `${remote}/${branch}`) {
                git.checkout(branchName, (err, result) => {
                  if (err) {
                    reject(err)
                  }
                })
              }
              // pulls
              git.pull((err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
              // installs additional nodes according to the generated package.json
              exec('npm install', (error, stdout, stderr) => {
                if (error) {
                  reject(error)
                }
              })
            }
          })
        }
      }
    })
  })
}
