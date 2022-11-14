const Model = require("./model.js");

class Handler extends Model
{
    async prepare() {

        if (typeof this.prepared != 'undefined')
            return this.prepared;

        if (typeof this.params.event != 'undefined') {
            this.instance.module(this.params.from).listeners.await[this.params.event] = this.params.params ?? {};
            this.prepared = true;
        } else {
            this.prepared = false;
        }

        return this.prepared;
    }
}

module.exports = Handler;