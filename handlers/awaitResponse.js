const Model = require("./model.js");
const util = require("util");

class Handler extends Model
{
    async prepare() {

        if (typeof this.prepared != 'undefined')
            return this.prepared;

        if (typeof this.params.event != 'undefined'
            && typeof this.params.response != 'undefined'
            && typeof this.params.request_index != 'undefined'
            && util.isFunction(this.instance.getTemp(this.params.event)[this.params.request_index])
        )
            this.instance.getTemp(this.params.event)[this.params.request_index](this.params.response);

        this.prepared = true;

        return this.prepared;
    }
}

module.exports = Handler;