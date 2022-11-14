class Controller
{
    constructor(module)
    {
        this.module = module;
        this.history = {};
        this.listeners = {
            "await" : {},
            "subscribers" : {}
        };
    }
}

module.exports = Controller;