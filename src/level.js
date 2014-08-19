function Level(instructions){
    this.instructions = instructions;
    this.messages = this.instructions.messages;
}

Level.prototype.setup = function(){
    return this.instructions.setup();
};

Level.prototype.getMenu = function(){
    return this.instructions.menu;
};
