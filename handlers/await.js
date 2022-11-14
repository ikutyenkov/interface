const Model = require("./model.js");
const Await = require("../../node_modules/micro-service-modules-await");

class Handler extends Model
{
    async prepare()
    {
        if (typeof this.prepared != 'undefined')
            return this.prepared;

        if (typeof this.params.event != 'undefined' && typeof this.params.to != 'undefined') {
            this.prepared = this.instance.module(this.params.to).listeners.await[this.params.event] ?? false;
        } else {
            this.prepared = false;
        }

        return this.prepared;
    }

    async execute() {

        if (typeof this.executed != 'undefined')
            return this.executed;

        this.executed = false;

            if (await this.prepare()) {

                let _listener = this.instance.socket.to(this.params.to);

                if (typeof _listener.emit != 'undefined') {

                    let _await = new Await(500, 20);
                    _await.ready = false;

                    await _listener.emit(this.instance.instance, Object.assign({"request_index" : this.instance.getTemp(this.params.event).length}, (this.params ?? {})));

                    this.instance.getTemp(this.params.event).push((response) => {
                        this.executed = response;
                        _await.ready = true;
                    });

                    await _await.wait();

                    return this.executed;
                }
            }

        return this.executed;
    }
}

module.exports = Handler;