define(function(){
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

    }

    PlayerMissile.prototype.collision = function(collidedWith) {
        //
    };

    PlayerMissile.prototype.update = function(){
        this.age++;

        if(this.age > this.maxAge){
            this.isAlive = false;
            return [];
        }

        this.location[0] += this.movement[0];
        this.location[1] += this.movement[1];
        return [];
    }

    PlayerMissile.prototype.getView = function() {
        return {
            location: this.location,
            type: this.type,
            rotation: this.rotation,
            blocks: this.blocks
        }
    };

    return PlayerMissile;
});