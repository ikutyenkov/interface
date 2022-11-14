const Model = require("./model.js");

class Handler extends Model
{
    async prepare()
    {
        if (typeof this.prepared != 'undefined')
            return this.prepared;

        if (typeof this.params.event != 'undefined' && typeof this.params.from != 'undefined') {
            this.prepared = this.instance.module(this.params.from).listeners.subscribers[this.params.event] ?? [];
        } else {
            this.prepared = false;
        }

        return this.prepared;
    }

    async execute() {

        if (typeof this.executed != 'undefined')
            return this.executed;
        //console.log(['prepare', await this.prepare()]);
        if (await this.prepare()) {

            for (let i = 0; i < this.prepared.length; i++) {

                let _listener = this.instance.socket.to(this.prepared[i]);
//console.log(['list', _listener]);
                if (typeof _listener.emit != 'undefined')
                    await _listener.emit(this.instance.instance, this.params ?? {});
            }

            this.instance.module(this.params.from).history[this.params.event] = this.params;

            this.executed = true;
        } else {
            this.executed = false;
        }

        return this.executed;
    }
}

module.exports = Handler;