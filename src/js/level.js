define(function(){
    function Level(n, instructions){
        this.level = n;
        this.instructions = instructions;
        this.messages = this.instructions.messages;
        this.events = this.instructions.events;
        this.proximityMessages = this.instructions.proximityMessages;
        this.proximityEvents = this.instructions.proximityEvents;
        this.hud = instructions.hud;
    }

    Level.prototype.setup = function(){
        console.log('level ' + this.level + ' set up');
        return this.instructions.setup();
    };

    Level.prototype.update = function(time, cameraPos) {
        var messages = [];
        if(this.instructions.update){
            messages = this.instructions.update(time, cameraPos);
        }
        return messages;
    };

    Level.prototype.getMenu = function(){
        return this.instructions.menu;
    };

    Level.prototype.getMessages = function(){
        return this.instructions.messages;
    };

    Level.prototype.getEvents = function() {
        return this.instructions.events;
    };

    Level.prototype.getProximityMessages = function() {
        return this.instructions.proximityMessages;
    };

    Level.prototype.getProximityEvents = function() {
        return this.instructions.proximityEvents;
    };

    Level.prototype.getHud = function() {
        return this.instructions.hud;
    };

    return Level;
});