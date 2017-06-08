
 var path = require("path");
 var git = require('simple-git');
 var fs = require('fs');
 var exec = require('child_process').exec;

module.exports = function(RED) {

    function gitNode(n) {
       "use strict";
        RED.nodes.createNode(this,n);
    };

    RED.nodes.registerType("git",gitNode);

    function commit(message, callback) {
        
        //deletes package.json and generates a new one based on node_modules, then commits all changes and pushes them to the remote branch
        
        fs.unlink('./package.json', function(err) {
            if (err) {
                callback(err,null);
            } else {
                exec('npm init -y', function(err, stdout, stderr) {
                    if (err)    {
                        callback(err, null)
                    } else if (stderr) {
                        callback(stderr, null)
                    } else {
                        git().add('--all').commit(message).push('origin','staging', function(err, data) {
                            if (err) {
                                callback(err, data)
                            } else {
                                callback(null, data)
                            }
                        });
                    }
                });
            }
        });
    };

    function sendFile(res,filename) {
        // Use the right function depending on Express 3.x/4.x
        if (res.sendFile) {
            res.sendFile(filename);
        } else {
            res.sendfile(filename);
        }
    }

    RED.httpAdmin.get('/git-ui/git-ui.html', function(req, res){
        var filename = path.join(__dirname , 'git-ui','git-ui.html');
        sendFile(res,filename);
    });  

    RED.httpAdmin.post("/git-ui/commit", function (req, res) {
        commit(req.body.comment, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send("OK");
            }
        });
    });
}
