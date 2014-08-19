function Game(levels){
    this.player = new Player();
    this.level = -1;
    this.mode = 'game';

    this.levels = levels;
    this.start();
}

Game.prototype.start = function() {
    this.level++;
    if(typeof this.levels[this.level] === 'undefined'){
        //game complete
    }else{
        this.mode = 'game';
        var levelStart = this.levels[this.level].setup();
        this.otherElements = levelStart.elements;
        this.player.reset();
        this.player.location = levelStart.playerLocation;
    }
    
};

Game.prototype.update = function() {
    var messages = [];
    
    messages = messages.concat(this.player.update());

    this.processCollisions();

    this.otherElements.forEach(function(element){
        messages = messages.concat(element.update());
    });

    this.processAllMessages(messages);

    this.otherElements = this.otherElements.filter(function(element){
        return element.isAlive;
    });


};

Game.prototype.getMode = function(){
    return this.mode;
};

Game.prototype.getPlayer = function() {
    return this.player.getView();
};

Game.prototype.updatePlayer = function(data){
    this.player.blocks = data;
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


Game.prototype.getMenu = function() {
    return this.levels[this.level].getMenu();
};

Game.prototype.processAllMessages = function(messages){
    var i = messages.length;
    messages.forEach(this.processMessage.bind(this));
};

Game.prototype.processMessage = function(message){
    switch(message.msg){
        case 'standard-player-fire':
            this.otherElements.push(new PlayerMissile(message.pos, message.rotation, message.movement.slice(0)));
            break;
        case 'level-complete':
            this.mode = 'level-complete';
            break;
    }
};

Game.prototype.processCollisions = function() {
    var allElements = this.otherElements.concat(this.player);
    allElements.forEach(function(element){

        allElements.forEach(function(element2){
            if(element === element2){
                return;
            }
            var el1 = element.getView();
            var el2 = element2.getView();


            // TODO - good collision detection
            if(Math.abs(el1.location[0] - el2.location[0]) > 50){
                return;
            }

            if(Math.abs(el1.location[1] - el2.location[1]) > 50){
                return;
            }

            element.collision(el2);
        });

    }.bind(this));
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