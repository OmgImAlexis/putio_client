const express  = require('express');
const path = require('path');
const config = require('cz');
const readTorrent = require('read-torrent');
const PutIO = require('put.io-v2');

config.load(path.normalize(__dirname + '/../../config.json'));
config.args();
config.store('disk');

module.exports = (function() {
    const app = express.Router();
    const api = new PutIO(config.get('putio:token'));

    app.get('/gui/token.html', function(req, res){
        res.send('<div id="token" style="display:none;">' + config.get('apiKey') + '</div>');
    });

    app.get('*', function(req, res, next){
        if(req.query.token === config.get('apiKey')){
            next();
        } else {
            res.send({
                error: 'Incorrect API key'
            });
        }
    });

    app.get('/gui/', function(req, res){
        if(req.query.action === 'add-url'){
            readTorrent(req.query.s, function(err, torrent) {
                if(err){
                    console.log(err);
                }
                api.transfers.add(torrent.infoHash);
                console.log('Added ' + torrent.name);
            });
        }
        return res.sendStatus(200);
    });

    app.get('*', function(req, res){
        res.send({
            error: 'Unknown Route'
        });
    });

    return app;
})();
