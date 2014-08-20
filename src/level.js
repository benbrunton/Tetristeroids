function Level(n, instructions){
    this.level = n;
    this.instructions = instructions;
    this.messages = this.instructions.messages;
    this.events = this.instructions.events;
    this.proximityMessages = this.instructions.proximityMessages;
    this.proximityEvents = this.instructions.proximityEvents;
}

Level.prototype.setup = function(){
    console.log('level ' + this.level + ' set up');
    return this.instructions.setup();
};

Level.prototype.getMenu = function(){
    return this.instructions.menu;
};
