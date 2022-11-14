class Model
{
    constructor(instance, params) {
        this.instance = instance;
        this.params = params;
        this.executed = undefined;
        this.prepared = undefined;

        if (typeof this.params.from == 'undefined' || typeof this.params.event == 'undefined')
            this.prepared = false;
    }

    async prepare()
    {
        return true;
    }

    async execute()
    {
        if (!(await this.prepare()))
            return false;

        return {"error" : false};
    }
}

module.exports = Model;