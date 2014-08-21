define(['shipBase'], function(ShipBase){
    function PlayerMissile(pos, rotation, movement){
        this.type = 'missile';
        this.blocks = [{
            location: [0, 0],
            type: 'missile'
        }];
        this.location = pos;
        this.rotation = rotation;
        this.power = 15;
        this.age = 0;
        this.maxAge = 80;
        this.isAlive = true;
        this.movement = [
            movement[0] + this.power * Math.sin(this.rotation),
            movement[1] - this.power * Math.cos(this.rotation)
        ];
        this.messageQueue = [];

    }

    PlayerMissile.prototype = new ShipBase();
    PlayerMissile.prototype.constructor = PlayerMissile;

    PlayerMissile.prototype.collision = function(report) {
        if(report.collided.type === 'player' || report.collided.type === 'cash' || report.collided.type === 'missile'){
            return;
        }

        this.messageQueue.push({
            msg:'explosion',
            location:this.location,
            size: 1
        });

        this.isAlive = false;
    };

    PlayerMissile.prototype.update = function(){
        this.age++;

        if(this.age > this.maxAge){
            this.isAlive = false;
            return [];
        }

        return ShipBase.prototype.update.call(this);
    };

    return PlayerMissile;
});