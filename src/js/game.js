define(['player', 'playerMissile', 'explosion', 'collisions', 'shipBase'], function(Player, PlayerMissile, Explosion, Collisions, ShipBase){

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
        this.player.save();
        if(typeof this.levels[this.level] === 'undefined'){
            this.mode = 'game-complete';
        }else{
            this.showIntro();
        }
        
    };

    Game.prototype.showIntro = function() {
        this.player.reset();
        if(this.levels[this.level].getIntro()){
            this.levelStatus = 'intro';
            this.mode = 'intro';
        }else{
            this.beginLevel();
            this.levelStatus = 'playing';
        }
    };

    Game.prototype.beginLevel = function(){
        this.player.save();
        this.levels[this.level].on('complete', function(){
            this.mode = 'level-complete';
            this.levelStatus = 'complete';
        }.bind(this));

        this.levels[this.level].on('player-stop', function(){
            this.player.stop();
        }.bind(this));
        
        this.playLevel();
    };

    Game.prototype.playLevel = function(){
        this.mode = 'game';
        this.levelTime = 0;
        var levelStart = this.levels[this.level].setup();
        this.otherElements = levelStart.elements;
        this.player.reset(levelStart.playerLocation);
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

        messages = messages.concat(this.levels[this.level].getMessageQueue());

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
        return playerView.location.slice();
    };

    Game.prototype.getElements = function(){
        var elements = [];
        var playerView = this.player.getView();
        elements.push(playerView);

        var otherElements = this.otherElements.filter(function(element){
            var v = element.getView();
            return v.type === 'objective' ||(Math.abs(v.location[0] - playerView.location[0]) < 300 
                && Math.abs(v.location[1] - playerView.location[1]) < 300);
        }).map(function(element){
            return element.getView();
        });

        return elements.concat(otherElements);
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
            case 'game-over':
                this.otherElements.push(new Explosion(this.getCamera(), 40));
                setTimeout(function(){
                    this.showIntro();
                }.bind(this), 2000);
                break;
            case 'add-elements':
                var newElements = message.elements.map(this._returnFullElement.bind(this));
                this.otherElements = this.otherElements.concat(newElements);
                break;
            case 'explosion':
                this.otherElements.push(new Explosion(message.location, message.size));
                break;
            case 'kill':
                this.otherElements = this.otherElements.filter(function(element){
                    var id = element.getView().id;
                    return id !== message.id;
                });
                break;
            default:
                break;
        }

    };

    Game.prototype.processCollisions = function() {
        var playerView = this.player.getView();
        var allElements = this.otherElements.filter(function(element){
            var v = element.getView();
            return v.type !== 'ignore' && (Math.abs(v.location[0] - playerView.location[0]) < 300 
                && Math.abs(v.location[1] - playerView.location[1]) < 300);
        });
        allElements.push(this.player);
        var i = allElements.length;
        var j, element, element2;
        while(i--){
            j = i;
            element = allElements[i];
            while(j--){
                element2 = allElements[j];
                if(element === element2){
                    continue;
                }
                var el1 = element.getView();
                var el2 = element2.getView();
                var report = this.collisions.check(el1, el2);
                
                if(report){
                    report.element1.blocks.length && element.collision(report.element1);
                    report.element2.blocks.length && element2.collision(report.element2);
                }

            }
        }
    };


    Game.prototype._returnFullElement = function(element) {
        if(typeof element.getView === 'function' 
            && typeof element.update === 'function' 
            && typeof element.collision === 'function'){
            return element;
        }

         var updatedElement = new ShipBase();
         for(var i in element){
            updatedElement[i] = element[i];
         }
         return updatedElement;

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

    Game.prototype.playerShield = function() {
        this.player.shield();
    };

    Game.prototype.playerAction = function(key) {
        this.player.action(key);
    };

    return Game;
});