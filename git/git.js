const path = require('path')
const http = require('http')
const gitUi = require('./git-ui/git-ui')

module.exports = (RED) => {
  const userDir = RED.settings.userDir
  const nodeRedHome = process.env.NODE_RED_HOME
  function gitUiNode (config) {
    RED.nodes.createNode(this, config)
  }
  RED.nodes.registerType('git-ui', gitUiNode)

  RED.httpAdmin.get('/git-ui/git-ui.html', (req, res) => {
    const filename = path.join(__dirname, 'git-ui', 'git-ui.html')
    gitUi.sendFile(res, filename)
  })

  RED.httpAdmin.post('/git-ui/commit', (req, res) => {
    gitUi.commit(userDir, req.body.message).then((result) => {
      res.status(200).send({ status: 'OK', result })
    }).catch((err) => {
      res.status(500).send(err)
    })
  })

  RED.httpAdmin.get('/git-ui/git-ui.css', (req, res) => {
    const filename = path.join(__dirname, 'git-ui', 'git-ui.css')
    gitUi.sendFile(res, filename)
  })

  RED.httpAdmin.get('/git-ui/logs/:branchName', (req, res) => {
    gitUi.logs(userDir, req.params.branchName).then((logList) => {
      res.status(200).send({ commits: logList.all })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/branches', (req, res) => {
    gitUi.branches(userDir).then((branchList) => {
      res.status(200).send({ branches: branchList.all, current: branchList.current })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.put('/git-ui/checkout/:branchName', (req, res) => {
    const userDir = RED.settings.userDir || RED.process.env.NODE_RED_HOME
    gitUi.cwd(userDir).then(() => {
      gitUi.checkout(userDir, req.params.branchName).then(() => {
        res.status(200).send({ status: 'OK' })
      }).catch((err) => {
        res.status(500).send({ error: err })
      })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/show/:hash/:fileName', (req, res) => {
    gitUi.show(userDir, req.params.hash, req.params.fileName).then((object) => {
      res.status(200).send({ object })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/show/:hash', (req, res) => {
    gitUi.show(userDir, req.params.hash, RED.settings.get('flowFile') || 'flows_' + require('os').hostname() + '.json').then((object) => {
      res.status(200).send({ object })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/status', (req, res) => {
    gitUi.status().then((statusSummary) => {
      res.status(200).send({ statusSummary })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/remote', (req, res) => {
    gitUi.remoteGet(userDir).then((url) => {
      res.status(200).send({ url })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.put('/git-ui/remote', (req, res) => {
    gitUi.remoteSet(userDir, req.body.url).then((url) => {
      res.status(200).send({ url })
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/fetch', (req, res) => {
    gitUi.fetch(userDir).then(() => {
      res.status(204).send()
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/pull', (req, res) => {
    gitUi.pull(userDir).then(() => {
      res.status(204).send()
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.put('/git-ui/update/:branchName', (req, res) => {
    gitUi.update(userDir, req.params.branchName, req.query.force || false).then(() => {
      res.status(204).send()
    }).catch((err) => {
      res.status(500).send({ error: err })
    })
  })

  RED.httpAdmin.get('/git-ui/checkuserdir', (req, res) => {
    if (userDir && userDir !== nodeRedHome && userDir !== nodeRedHome.substring(0, nodeRedHome.indexOf('/node_modules/node-red'))) {
      res.status(204).send()
    } else {
      res.status(500).send({ error: 'node-red was started using the installation directory or the directory that contains node_modules/node-red as userDir. This will cause issues with git-ui. Please see README for more details.' })
    }
  })

  RED.httpAdmin.put('/git-ui/createLocalRepo', (req, res) => {
    gitUi.createLocalRepo(userDir).then((url) => {
      res.status(200).send({ status: 'OK' })
    }).catch((err) => {
      res.status(500).send(err)
    })
  })

  RED.httpAdmin.post('/git-ui/deploy', (req, res) => {
    const options = {
      hostname: 'localhost',
      port: RED.settings.uiPort,
      path: '/flows',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Node-RED-Deployment-Type': 'reload'
      }
    }
    const redapi = http.request(options, (r) => {
    })

    redapi.on('error', (e) => {
      res.status(500).send({ error: e })
    })

    redapi.on('response', () => {
      res.status(204).send()
    })

    redapi.write(JSON.stringify(req.body))
    redapi.end()
  })
}
