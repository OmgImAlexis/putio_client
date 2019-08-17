const express = require('express');
const path = require('path');
const config = require('cz');
const readTorrent = require('read-torrent');
const PutIO = require('put.io-v2');

config.load(path.normalize(__dirname + '/../../config.json'));
config.args();
config.store('disk');

function determine_status_value(status) {
    if (status === 'DOWNLOADING') {
        return 1;
    } else if (status === 'COMPLETED') {
        return 136;	
    } else if (status === 'IN_QUEUE') {
        return 64;	
    } else if (status === 'SEEDING') {
        return 136;
    }
    console.log(status);
    return 16;
}

function validate_eta(eta) {
    if (eta === null) {
	return 0;
    }
    return eta;
}

function validate_availability(availability, total) {
    var MAX_INT32 = Math.pow(2, 31) - 1;
    if (availability === null) {
	if (total > MAX_INT32) {
	    return MAX_INT32;
	}
        return total;
    } else if (availability > MAX_INT32) {
        return MAX_INT32;
    }
    return availability;
}

function determine_remaining(size, downloaded, status) {
    if (status === 'COMPLETED') {
	return 0;
    }
    var remaining = size - downloaded;
    var MAX_INT32 = Math.pow(2, 31) - 1;
    if (remaining > MAX_INT32) {
        return MAX_INT32
    }
    return remaining;
}

function validate_size(size) {
    var MAX_INT32 = Math.pow(2, 31) - 1;
    if (size > MAX_INT32) {
        return MAX_INT32;
    }
    return size;
}

module.exports = (function () {
    const app = express.Router();
    const api = new PutIO(config.get('putio:token'));

    app.get('/gui/token.html', function (req, res) {
	console.log('Authenticating...');
        res.send('<div id="token" style="display:none;">' + config.get('apiKey') + '</div>');
    });

    app.get('*', function (req, res, next) {
        if (req.query.token === config.get('apiKey')) {
            next();
        } else {
            res.send({
                error: 'Incorrect API key'
            });
        }
    });

    app.post('*', function (req, res, next) {
        if (req.query.token === config.get('apiKey')) {
            next();
        } else {
            res.send({
                error: 'Incorrect API key'
            });
        }
    });

    app.get('/gui/', function (req, res) {
        if (req.query.action === 'add-url') {
            readTorrent(req.query.s, function (err, torrent) {
                if (err) {
                    console.log(err);
		    return res.status(500).end();
                }
		console.log('Adding ' + torrent.name);
                api.transfers.add(torrent.infoHash, parent_id = 532048861);
                console.log('Added ' + torrent.name);
            });
            return res.send({});
        } else if (req.query.action === 'getsettings') {
            console.log('Getting settings...');
            return res.send({
                "build": 44632, "settings": [
                    ["install_modification_time", 0, "0", { "access": "Y" }]
                ]
            });
        } else if (req.query.action === 'remove') {
            api.transfers.cancel(req.query.hash);
            console.log('Canceled torrent ' + req.query.hash);
            return res.status(200).end();
        } else if (req.query.action === 'removedata') {
            api.transfers.cancel(req.query.hash);
	    console.log('Canceled torrent ' + req.query.hash);
            return res.status(200).end();
        } else if (req.query.list === '1') {
            api.transfers.list(function (data) {
                ret_data = {
                    "build": 44994
                    , "torrents": []
                    , "label": [["shows", 532048861]]
                    , "torrentc": "994925276"
                    , "rssfeeds": []
                    , "rssfilters": []
                }
                for (var transfer_index in data.transfers) {
		    var transfer = data.transfers[transfer_index];
		    var detail = [
			transfer.id,
			determine_status_value(transfer.status),	
			transfer.name,
			validate_size(transfer.size),
			transfer.percent_done * 10,
			transfer.downloaded,
			transfer.uploaded,
			Math.round(transfer.current_ratio * 100),
			transfer.up_speed,
			transfer.down_speed,
			validate_eta(transfer.estimated_time),
			"shows",
			transfer.peers_connected,
			transfer.peers_getting_from_us + transfer.peers_sending_to_us,
			transfer.peers_connected,
			transfer.peers_sending_to_us,
			validate_availability(transfer.availability, transfer.size),
			transfer.id, 
			determine_remaining(transfer.size, transfer.downloaded, transfer.status),
			"",
			"",
			transfer.status,
			"1",
			1550730519,
			0,
			"",
                        config.get('putio:download_dir'),
			0,
			"4767C3CE"
		    ];
                    ret_data['torrents'].push(detail);
                }
                return res.json(ret_data);
            });
        } else {
            console.log('invalid endpoint: ' + req.query.action);
            console.log('query parameters: ' + req.query);
            return res.send('{"status":"unknown"}');
        }
    });

    app.get('*', function (req, res) {
        res.send({
            error: 'Unknown Route'
        });
    });

    return app;
})();
