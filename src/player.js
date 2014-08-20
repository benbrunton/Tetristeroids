define(['shipBase'], function(ShipBase){

    function Player(){
        
        this.messageQueue = [];

        this.cash = 0;

        this.lastFired = 0;

        this.type = 'player';
        this.movement = [0, 0];
        this.location = [0, 0];
        this.rotation = 0;

        this.blocks = [
            {
                location: [0, -1], 
                type: 'shield'
            },
            {
                location: [0, 0], 
                type: 'cockpit'
            },
            {
                location: [0, 1],
                type: 'engine'
            },
            {
                location: [1, -1], 
                type: 'shield'  
            },
            {
                location: [-1, -1], 
                type: 'shield'  
            }
        ];

    }

    Player.prototype = new ShipBase();
    Player.prototype.constructor = Player;


    Player.prototype.reset = function() {
        this.movement = [0, 0];
        this.location = [0, 0];
        this.rotation = 0;
    };


    Player.prototype.collision = function(collidedWith) {
        switch(collidedWith.type){
            case 'cash':
                this.cash += collidedWith.value;
                break;
        }
    };

    Player.prototype.power = function() {
        var power = this.blocks.filter(function(block){
            return block.type === 'engine';
        }).length / 2;
        return power / this.blocks.length;
    };

    Player.prototype.rotateAmount = function(){
        return this.power() / this.blocks.filter(function(block){
            return block.type !== 'engine';
        }).length;
    };

    Player.prototype.forward = function() {
        var r = this.rotation;// * Math.PI / 180;
        var p = this.power();
        this.movement[0] += p * Math.sin(r);//(r* PI) / 180.0;
        this.movement[1] -= p * Math.cos(r);
    };

    Player.prototype.backward = function() {
        var r = this.rotation;
        var p = this.power() / 2;
        this.movement[0] -= p * Math.sin(r);
        this.movement[1] += p * Math.cos(r);
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
                this.messageQueue.push({msg:'standard-player-fire', pos:this.getMissileLocation(block.location), rotation:this.rotation, movement:this.movement});
            }.bind(this));

        this.lastFired = Date.now();
    };

    Player.prototype.getMissileLocation = function(loc){
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

    return Player;

});