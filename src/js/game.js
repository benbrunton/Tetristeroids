define(['player', 'playerMissile', 'explosion', 'collisions'], function(Player, PlayerMissile, Explosion, Collisions){

    function Game(levels){
        this.player = new Player();
        this.collisions = new Collisions();
        this.level = -1;
        this.levelTime = 0;
        this.mode = 'game';

        this.levels = levels;
        this.messages = [];
        this.start();
    }

    Game.prototype.start = function() {
        this.level++;
        this.player.cacheBlocks();
        if(typeof this.levels[this.level] === 'undefined'){
            this.mode = 'game-complete';
        }else{
            this.showIntro();
        }
        
    };

    Game.prototype.showIntro = function() {
        if(this.levels[this.level].getIntro()){
            this.levelStatus = 'intro';
            this.mode = 'intro';
        }else{
            this.beginLevel();
            this.levelStatus = 'playing';
        }
    };

    Game.prototype.beginLevel = function(){
        this.mode = 'game';
        this.levelTime = 0;
        var levelStart = this.levels[this.level].setup();
        this.otherElements = levelStart.elements;
        this.player.reset();
        this.player.location = levelStart.playerLocation;
        this.levels[this.level].on('complete', function(){
            this.mode = 'level-complete';
            this.levelStatus = 'complete';
        }.bind(this));
    };

    Game.prototype.update = function() {
        var messages = [];
        
        messages = messages.concat(this.player.update());

        this.processCollisions();

        this.otherElements.forEach(function(element){
            messages = messages.concat(element.update());
        });

        if(this.levels[this.level].getEvents()[this.levelTime]){
            messages = messages.concat(this.levels[this.level].getEvents()[this.levelTime].execute(this.getPlayer()));
        }

        messages = messages.concat(this.levels[this.level].update(this.levelTime, this.getCamera()));

        this.processAllMessages(messages);

        this.otherElements = this.otherElements.filter(function(element){
            return element.isAlive;
        });

        this.levelTime++;

    };

    Game.prototype.getMessages = function() {
        var messages = this.messages;
        this.messages = [];
        if(this.levels[this.level].getMessages()[this.levelTime]){
            messages.push(this.levels[this.level].getMessages()[this.levelTime]);
        }

        return messages;
    };

    Game.prototype.getMode = function(){
        return this.mode;
    };

    Game.prototype.getHud = function(){
        return this.levels[this.level].getHud();
    };

    Game.prototype.getPlayer = function() {
        return this.player.getView();
    };

    Game.prototype.updatePlayer = function(data){
        this.player.blocks = data.blocks;
        this.player.cash = data.cash;
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
        return this.levelStatus === 'complete' ? this.levels[this.level].getMenu() :
            this.levels[this.level].getIntro();
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
            // case 'level-complete':
            //     this.mode = 'level-complete'; // todo - pass this messages to the level
            //                                   // to allow it to wrap up
            //     break;
            case 'game-over':
                this.beginLevel();
                break;
            case 'add-elements':
                this.otherElements = this.otherElements.concat(message.elements);
                break;
            case 'explosion':
                this.otherElements.push(new Explosion(message.location, message.size));
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


                var report = this.collisions.check(el1, el2);

                if(!report){
                    return;
                }

                element.collision(report);
            }.bind(this));

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

    return Game;
});