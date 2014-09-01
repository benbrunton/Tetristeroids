define(['shipBase'], function(ShipBase){

    function SimpleShip(blocks, location, rotation, movement, maxAge){
        this.location = location;
        this.blocks = blocks;
        this.type = 'ship';
        this.rotation = rotation;
        this.cash = 0;
        this.messageQueue = [];
        this.isAlive = true;
        this.movement = movement;
        this.cachedMovement = movement;
        this.age = 0;
        this.maxAge = maxAge;
    }

    SimpleShip.prototype = new ShipBase();
    SimpleShip.prototype.constructor = SimpleShip;

    // just continues on it's way
    SimpleShip.prototype.update = function(){
        this.age++;
        if(this.age > this.maxAge && this.maxAge > -1){
            this.isAlive = false;
            this.messageQueue.push({
                msg:'explosion',
                location:this.location,
                size: this.blocks.length
            });
        }
        this.movement = this.cachedMovement.slice();
        return ShipBase.prototype.update.call(this);
    };

    return SimpleShip;
});