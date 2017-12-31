#! /usr/bin/env node
var Imports;
(function (Imports) {
    Imports.formidable = require('formidable');
    Imports.http = require('http');
    Imports.express = require('express');
    Imports.WebSocket_ = require('ws');
    Imports.spawn = require("child_process").spawn;
    Imports.path_ = require("path");
    Imports.bodyParser = require('body-parser');
    Imports.fs = require("fs");
})(Imports || (Imports = {}));
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// server parameters
let ___dirname = __dirname;
let ___port = 9000;
///////////////////////////////////////////////////////////// 
class CommandLineOption {
    constructor(fullName, shortName, numargs) {
        this.numargs = 0;
        this.args = [];
        this.fullName = fullName;
        this.shortName = shortName;
        this.numargs = numargs;
    }
}
var CommandLineOptions;
(function (CommandLineOptions) {
    CommandLineOptions.allowedOptions = [];
    CommandLineOptions.parsedOptions = {};
    function parseOptions() {
        CommandLineOptions.parsedOptions = {};
        if (process.argv.length > 2) {
            let i = 2;
            while (i < process.argv.length) {
                let arg = process.argv[i];
                let found = null;
                for (let ao of CommandLineOptions.allowedOptions) {
                    if ((ao.fullName == arg) || (ao.shortName == arg)) {
                        found = new CommandLineOption(ao.fullName, ao.shortName, ao.numargs);
                        break;
                    }
                }
                if (found != null) {
                    let numargs = found.numargs;
                    if ((i + numargs) >= process.argv.length) {
                        return;
                    }
                    for (let j = 0; j < numargs; j++) {
                        found.args.push(process.argv[(i + 1) + j]);
                    }
                    i += (numargs + 1);
                    CommandLineOptions.parsedOptions[found.fullName] = found;
                }
                else {
                    console.log("invalid option " + arg);
                    i++;
                }
            }
        }
    }
    CommandLineOptions.parseOptions = parseOptions;
})(CommandLineOptions || (CommandLineOptions = {}));
var System;
(function (System) {
    var path_ = Imports.path_;
    var fs = Imports.fs;
    function joinPaths(path1, path2) {
        if (path1 == "")
            return path2;
        if (path1.substr(path1.length - 1) == "/")
            return path1 + path2;
        return path1 + "/" + path2;
    }
    System.joinPaths = joinPaths;
    function listDir(path, callback) {
        console.log(`listing directory ${path}`);
        fs.readdir(path, (err, files) => {
            console.log(err, files);
            if (err != null) {
                callback(err, []);
                return;
            }
            callback(err, files.map(file => {
                let fpath = joinPaths(path, file);
                let fstats = {
                    ok: true,
                    name: file,
                    isfile: true,
                    isdir: false,
                    stats: {}
                };
                try {
                    let stats = fs.statSync(fpath);
                    fstats.isfile = stats.isFile();
                    fstats.isdir = stats.isDirectory();
                    fstats.stats = stats;
                    //console.log(stats)
                }
                catch (err) {
                    console.log(`no stats for ${fpath}`);
                    fstats.ok = false;
                }
                return fstats;
            }));
        });
    }
    System.listDir = listDir;
    function createDir(path, name, callback) {
        let fullpath = path + name;
        console.log(`creating directory ${fullpath}`);
        fs.mkdir(fullpath, (err) => {
            if (err)
                console.log(`failed creating ${fullpath}`);
            listDir(path, callback);
        });
    }
    System.createDir = createDir;
    function removeDir(path, name, callback) {
        let fullpath = path + name;
        console.log(`removing directory ${fullpath}`);
        fs.rmdir(fullpath, (err) => {
            if (err)
                console.log(`failed removing ${fullpath}`);
            listDir(path, callback);
        });
    }
    System.removeDir = removeDir;
    function writeTextFile(path, content, callback) {
        console.log(`writing text file ${path}`);
        fs.writeFile(path, content, function (err) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            console.log(`written ${content.length} characters`);
            callback(err);
        });
    }
    System.writeTextFile = writeTextFile;
    function readTextFile(path, callback) {
        console.log(`reading text file ${path}`);
        fs.readFile(path, { encoding: 'utf-8' }, function (err, data) {
            if (!err) {
                console.log(`read ${data.length} characters`);
                callback(err, data);
            }
            else {
                console.log(err);
                callback(err, data);
            }
        });
    }
    System.readTextFile = readTextFile;
    function copyFile(pathFrom, pathTo, callback) {
        console.log(`copying file ${pathFrom} -> ${pathTo}`);
        fs.copyFile(pathFrom, pathTo, function (err) {
            if (!err) {
                console.log(`file copied ok`);
                callback(err);
            }
            else {
                console.log(`error: copying file failed`);
                console.log(err);
                callback(err);
            }
        });
    }
    System.copyFile = copyFile;
    function moveFile(pathFrom, pathTo, callback) {
        console.log(`moving file ${pathFrom} -> ${pathTo}`);
        copyFile(pathFrom, pathTo, err => {
            if (!err) {
                deleteFile(pathFrom, err => {
                    callback(err);
                });
            }
            else {
                callback(err);
            }
        });
    }
    System.moveFile = moveFile;
    function renameFile(pathFrom, pathTo, callback) {
        console.log(`renaming file ${pathFrom} -> ${pathTo}`);
        fs.rename(pathFrom, pathTo, function (err) {
            if (!err) {
                console.log(`file renamed ok`);
                callback(err);
            }
            else {
                console.log(`error: renaming file failed`);
                console.log(err);
                callback(err);
            }
        });
    }
    System.renameFile = renameFile;
    function deleteFile(path, callback) {
        console.log(`deleting file ${path}`);
        fs.unlink(path, function (err) {
            if (!err) {
                console.log(`file deleted ok`);
                callback(err);
            }
            else {
                console.log(`error: deleting file failed`);
                console.log(err);
                callback(err);
            }
        });
    }
    System.deleteFile = deleteFile;
    function updateVersion() {
        console.log("updating package.json version");
        let path = path_.join(___dirname, "package.json");
        System.readTextFile(path, (err, data) => {
            if (err) {
                console.log("failed: package.json could not be read");
                return;
            }
            else {
                let pjson;
                try {
                    pjson = JSON.parse(data);
                }
                catch (e) {
                    console.log("fatal: package.json is not valid json");
                    return;
                }
                let version = pjson.version;
                console.log("current version " + version);
                if ((version == null) || ((typeof version) != "string")) {
                    console.log("fatal: package version is not valid string");
                    return;
                }
                let parts = version.split(".");
                if (parts.length != 3) {
                    console.log("fatal: version format incorrect, wrong number of parts");
                    return;
                }
                let vnums = parts.map(part => parseInt(part));
                if (vnums.some((value, index, array) => { return (isNaN(value)) || (value < 0) || (Math.floor(value) != value); })) {
                    console.log("fatal: version parts are not all natural numbers");
                    return;
                }
                let newversion = `${vnums[0]}.${vnums[1]}.${vnums[2] + 1}`;
                console.log("new version " + newversion);
                pjson.version = newversion;
                let jsontext = JSON.stringify(pjson, null, 2);
                console.log("writing new package.json");
                writeTextFile(path, jsontext, err => { });
            }
        });
    }
    System.updateVersion = updateVersion;
    function githubApiRequest(url, config) {
        let API_URL = "https://api.github.com";
        const axios = require('axios');
        let req_url = `${API_URL}/${url}`;
        let response;
        config.url = req_url;
        console.log(req_url, config);
        return axios(config);
    }
    System.githubApiRequest = githubApiRequest;
})(System || (System = {}));
var Server;
(function (Server) {
    Server.ajaxHandler = function (req, res) {
        let action = req.body.action;
        console.log(`ajax ${action}`);
        let b = req.body;
        res.setHeader("Content-Type", "application/json");
        if (action == "listdir") {
            System.listDir(b.path, (err, files) => {
                let result = { err: err, files: files };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "createdir") {
            System.createDir(b.path, b.name, (err, files) => {
                let result = { err: err, files: files };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "removedir") {
            System.removeDir(b.path, b.name, (err, files) => {
                let result = { err: err, files: files };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "writetextfile") {
            System.writeTextFile(b.path, b.content, (err) => {
                let result = { err: err };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "readtextfile") {
            System.readTextFile(b.path, (err, data) => {
                let result = {
                    error: false,
                    content: ""
                };
                if (err) {
                    result.error = true;
                }
                else {
                    result.content = data;
                }
                res.send(JSON.stringify(result));
            });
        }
        if (action == "copyfile") {
            System.copyFile(b.pathFrom, b.pathTo, (err) => {
                res.send(JSON.stringify(err));
            });
        }
        if (action == "movefile") {
            System.moveFile(b.pathFrom, b.pathTo, (err) => {
                res.send(JSON.stringify(err));
            });
        }
        if (action == "renamefile") {
            System.renameFile(b.pathFrom, b.pathTo, (err) => {
                res.send(JSON.stringify(err));
            });
        }
        if (action == "deletefile") {
            System.deleteFile(b.path, (err) => {
                res.send(JSON.stringify(err));
            });
        }
        if (action == "githubapi") {
            System.githubApiRequest(b.url, b.config).then(response => {
                res.send(JSON.stringify({
                    ok: true,
                    result: response.data
                }));
            }).catch(err => {
                console.log(err);
                res.send(JSON.stringify({
                    ok: false,
                    result: {}
                }));
            });
        }
    };
})(Server || (Server = {}));
/////////////////////////////////////////////////////////////
// command line
CommandLineOptions.allowedOptions = [
    new CommandLineOption("--dirname", "-d", 1),
    new CommandLineOption("--port", "-p", 1),
    new CommandLineOption("--githubapi", "-g", 1),
    new CommandLineOption("--username", "-un", 1),
    new CommandLineOption("--password", "-pw", 1),
    new CommandLineOption("--method", "-mt", 1),
    new CommandLineOption("--data", "-dt", 1)
];
CommandLineOptions.parseOptions();
let po = CommandLineOptions.parsedOptions;
let doServer = true;
if (po["--githubapi"] != undefined) {
    let url = po["--githubapi"].args[0];
    let config = {
        method: 'get'
    };
    if ((po["--username"] != undefined) && (po["--password"] != undefined)) {
        config.auth = {
            username: po["--username"].args[0],
            password: po["--password"].args[0]
        };
    }
    if (po["--method"] != undefined) {
        config.method = po["--method"].args[0];
    }
    if (po["--data"] != undefined) {
        config.data = JSON.parse(po["--data"].args[0]);
    }
    System.githubApiRequest(url, config).then(response => {
        console.log(response.data);
    }).catch(err => { console.log(err); });
    doServer = false;
}
if (po["--dirname"] != undefined) {
    ___dirname = po["--dirname"].args[0];
}
if (po["--port"] != undefined) {
    ___port = parseInt(po["--port"].args[0]) || 9000;
}
/////////////////////////////////////////////////////////////
if (doServer) {
    console.log(`server directory ${__dirname}`);
    console.log(`files will be served from ${___dirname}`);
    console.log(`port ${___port}`);
    createServer();
}
/////////////////////////////////////////////////////////////
function createServer() {
    const app = Imports.express();
    app.use('/', Imports.express.static(___dirname));
    app.use('/ajax', Imports.bodyParser.json({ limit: '10mb' }));
    app.post('/ajax', Server.ajaxHandler);
    const server = Imports.http.createServer(app);
    server.listen(___port, () => {
        console.log(`Node server started on port ${server.address().port}`);
    });
}
///////////////////////////////////////////////////////////// 
