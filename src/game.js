function Game(){
    this.player = new Player();
    this.otherElements = [];
}

Game.prototype.update = function() {
    var messages = [];
    
    messages = messages.concat(this.player.update());

    this.otherElements.forEach(function(element){
        messages = messages.concat(element.update());
    });

    this.processAllMessages(messages);
};

Game.prototype.getCamera = function() {
    var playerView = this.player.getView();
    return playerView.location;
};

Game.prototype.getElements = function(){
    var elements = [];
    elements.push(this.player.getView());

    var otherElements = this.otherElements.map(function(element){
        return element.getView();
    });

    return elements.concat(otherElements);;
};

Game.prototype.processAllMessages = function(messages){
    var i = messages.length;
    messages.forEach(this.processMessage.bind(this));
};

Game.prototype.processMessage = function(message){
    switch(message.msg){
        case 'standard-player-fire':
            this.otherElements.push(new PlayerMissile(message.pos, message.rotation));
            break;
    }
};



Game.prototype.movePlayerForward = function(){
    this.player.forward();
};

Game.prototype.movePlayerBackward = function(){
    this.player.backward();
};

Game.prototype.movePlayerLeft = function(){
    this.player.left();
};

Game.prototype.movePlayerRight = function(){
    this.player.right();
};

Game.prototype.playerFires = function(){
    this.player.fire();
};