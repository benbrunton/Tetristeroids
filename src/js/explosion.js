define(function(){

    var MAX_AGE = 35;

    function Explosion(pos, size){
        this.age = 0;
        this.isAlive = true;
        this.size = size * 2;
        this.location = pos.slice();
    }

    Explosion.prototype.getView = function() {
        return {
            location: this.location.slice(),
            blocks: [this._getBlock()],
            type: 'ignore',
            rotation:0,
            cash:0
        };
    };

    Explosion.prototype.update = function(){
        this.age++;
        if(this.age > MAX_AGE){
            this.isAlive = false;
        }

        return [];
    };

    Explosion.prototype.collision = function(collidedWith) {};

    Explosion.prototype._getBlock = function(){
        return {
            type: 'explosion',
            location: [0, 0],
            size: this.size,
            age: this.age
        }
    };

    return Explosion;
});