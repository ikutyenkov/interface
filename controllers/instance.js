const Module = require("./module.js");

class Controller
{
    constructor(socket, instance)
    {
        this.socket = socket;
        this.instance = instance;
        this.modules = {};
        this.temps = {};
    }

    module(name)
    {
        if (typeof this.modules[name] == 'undefined')
            this.modules[name] = new Module(name);

        return this.modules[name];
    }

    getTemp(event)
    {
        if (typeof this.temps[event] == 'undefined')
            this.temps[event] = [];

        return this.temps[event];
    }

}

module.exports = Controller;