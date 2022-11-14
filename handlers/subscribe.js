const Model = require("./model.js");

class Handler extends Model
{
    async prepare() {

        if (typeof this.prepared != 'undefined')
            return this.prepared;

        if (typeof this.params.event != 'undefined' && typeof this.params.to != 'undefined') {

            if (typeof this.instance.module(this.params.to).listeners.subscribers[this.params.event] == 'undefined')
                this.instance.module(this.params.to).listeners.subscribers[this.params.event] = [];

            if (!this.instance.module(this.params.to).listeners.subscribers[this.params.event].includes(this.params.from))
                this.instance.module(this.params.to).listeners.subscribers[this.params.event].push(this.params.from);

            if (this.instance.module(this.params.to).history[this.params.event])
                await this.instance.socket.to(this.params.from).emit(this.instance.instance, this.instance.module(this.params.to).history[this.params.event]);

            this.prepared = true;
        } else {
            this.prepared = false;
        }

        return this.prepared;
    }
}

module.exports = Handler;