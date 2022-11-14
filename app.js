const config = require("./config.json");
const express = require('../node_modules/express');
const http = require("http");
const { Server } = require("../node_modules/socket.io");
const util = require("util");
const Instance = require("./controllers/instance.js");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    "cors": {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    }
});

app.use(express.json({limit: '256kb'}));
app.use(express.urlencoded({limit: '256kb', extended: true}));

class App
{
    constructor()
    {
        this.instances = {};

        if ((config.port ?? 0) > 0) {

            server.listen(config.port, () => {
                console.log('listening on *:' + config.port);
                this.listen().then();
            });
        }
    }

    async listen() {

        io.on('connection', (socket) => {

            console.log('connection');

            socket.on("disconnect", (reason) => {
                console.log('disconnections');
            });

            socket.onAny(async (instance, params, callback) => {

                if (instance === 'join' && typeof params.module != 'undefined')
                    return socket.join(params.module);

                if (typeof params.type != 'undefined' && typeof params.event != 'undefined') {

                    if (typeof this.instances[instance] == 'undefined')
                        this.instances[instance] = new Instance(io, instance, socket);

                    let _response = {"error": true, "error_str": "unknown error!"};

                    try {
                        _response = await (new (require("./handlers/" + (params.type ?? undefined) + ".js"))(this.instances[instance], params)).execute();
                    } catch (e) {
                        console.log(e);
                    }

                    if (util.isFunction(callback))
                        callback(_response);

                    return _response;
                }
            });
        });
    }
}

module.exports = new App();