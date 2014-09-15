define(['shipBase'], function(ShipBase){

    function Player(){
        
        this.messageQueue = [];

        this.cash = 25000;

        this.lastFired = 0;

        this.type = 'player';
        this.movement = [0, 0];
        this.location = [0, 0];
        this.rotation = 0;

        this.blocks = [
            {
                location: [0, -1], 
                type: 'shield',
                damage: 100
            },
            {
                location: [0, 0], 
                type: 'cockpit',
                damage: 2
            },
            {
                location: [0, 1],
                type: 'engine',
                damage: 2

            },
            {
                location: [1, -1], 
                type: 'shield',
                damage: 100
            },
            {
                location: [-1, -1], 
                type: 'shield',
                damage: 100
            }
        ];

    }

    Player.prototype = new ShipBase();
    Player.prototype.constructor = Player;

    Player.prototype.update = function(){

        if(this.blocks.length < 1 || !this.blocks.some(function(block){
            return block.type === 'cockpit';
        })){
            // game over
            this.messageQueue.push({msg:'game-over'});
        }

        return ShipBase.prototype.update.call(this);
    };


    Player.prototype.reset = function(location) {
        this.movement = [0, 0];
        this.location = location ? location.slice() : [0, 0];
        this.rotation = 0;
        this.blocks = JSON.parse(this.cachedBlocks);
        this.cash = this.cachedCash;
    };


    Player.prototype.collision = function(report) {
        switch(report.collided.type){
            case 'cash':
                this.cash += report.collided.value;
                break;
            case 'player-missile':
                break;
            default:
                report.blocks.forEach(this._damageBlock.bind(this));
                break;
        }
    };

    Player.prototype.save = function(){
        this.cachedBlocks = JSON.stringify(this.blocks);
        this.cachedCash = this.cash;
    };

    Player.prototype.power = function() {
        var power = this.blocks.filter(function(block){
            return block.type === 'engine';
        }).length / 8;
        return (power / this.blocks.length) + 0.002;
    };

    Player.prototype.max_power = function(){
        var engines = this.blocks.filter(function(block){
            return block.type === 'engine';
        }).length;

        return (engines * 3 * engines * 3) || 10;
    };

    Player.prototype.rotateAmount = function(){
        var left = 0;
        var right = 0;
        var top = 0;
        var bottom = 0;
        this.blocks.forEach(function(block){
            if(block.location[0] > right){
                right = block.location[0];
            }
            if(block.location[0] < left){
                left = block.location[0];
            }
            if(block.location[1] > bottom){
                bottom = block.location[1];
            }
            if(block.location[1] < top){
                top = block.location[1];
            }
        });
        var longestLength = Math.max(bottom - top, right - left);
        return (0.3 / longestLength) + 0.005;
    };

    Player.prototype.forward = function() {
        var r = this.rotation;// * Math.PI / 180;
        var p = this.power();
        var newMovementX = this.movement[0] + p * Math.sin(r);
        var newMovementY = this.movement[1] - p * Math.cos(r);
        while(newMovementX * newMovementX + newMovementY * newMovementY > this.max_power()){
            newMovementX *= 0.99;
            newMovementY *= 0.99;
        }
        this.movement[0] = newMovementX;
        this.movement[1] = newMovementY;
    };

    Player.prototype.backward = function() {
        var r = this.rotation;
        var p = this.power() / 2;
        var newMovementX = this.movement[0] - p * Math.sin(r);
        var newMovementY = this.movement[1] + p * Math.cos(r);
        if(newMovementX * newMovementX + newMovementY * newMovementY < this.max_power()){
            this.movement[0] = newMovementX;
            this.movement[1] = newMovementY;
        }
    };

    Player.prototype.left = function() {
        //this.location[0] -= this.power();
        this.rotation -= this.rotateAmount();
    };

    Player.prototype.right = function() {
        //this.location[0] += this.power();
        this.rotation += this.rotateAmount();
    };

    Player.prototype.fire = function(){
        if(Date.now() - 100 < this.lastFired){
            return;
        }
        this.blocks.filter(function(block){
                return block.type === 'standard-gun';
            })
            .forEach(function(block){
                this.messageQueue.push({msg:'standard-player-fire', pos:this.getBlockLocation(block.location), rotation:this.rotation, movement:this.movement});
            }.bind(this));

        this.lastFired = Date.now();
    };

    Player.prototype.getBlockLocation = function(loc){
        var s = Math.sin(this.rotation);
        var c = Math.cos(this.rotation);
        var l1 = loc[0] * 10;
        var l2 = loc[1] * 10;
        var x1 = this.location[0] + this.movement[0];
        var y1 = this.location[1] + this.movement[1];
        var x2 = c * l1 - s * l2;
        var y2 = s * l1 + c * l2;
        return [x1 + x2, y1 + y2];
    };

    Player.prototype._damageBlock = function(block){
        block.damage--;
        this.messageQueue.push({
            msg: 'explosion',
            location: this.getBlockLocation(block.location),
            size: Math.random() * 3
        });
        this.blocks = this.blocks.filter(function(block){
            return block.damage > 0;
        });
    };

    return Player;

});