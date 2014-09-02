define(function(){
    function Event(){
        this.listeners = {};
    }

    Event.prototype.on = function(type, callback){
        if(!this.listeners[type]){
            this.listeners[type] = [];
        }

        this.listeners[type].push(callback);
    };

    Event.prototype.emit = function(type, data){
        if(!this.listeners[type]){
            return;
        }

        this.listeners[type].forEach(function(callback){
            callback(data);
        });
    };

    return Event;
});