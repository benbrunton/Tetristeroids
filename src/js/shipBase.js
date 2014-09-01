define(function(){

    function ShipBase(){}

    ShipBase.prototype.getView = function() {
        return {
            location: this.location.slice(),
            blocks: this.blocks.slice(),
            type: this.type,
            rotation:this.rotation,
            cash: this.cash
        };
    };

    ShipBase.prototype.update = function(){
        var messages = [];
        messages = messages.concat(this.messageQueue);
        this.messageQueue = [];

        this.location[0] += this.movement[0];
        this.location[1] += this.movement[1];

        this.movement[0] *= 0.99;
        this.movement[1] *= 0.99;

        if(this.blocks.length < 1){
            this.isAlive = false;
        }

        return messages;
    };

    ShipBase.prototype.collision = function(collidedWith) {};

    return ShipBase;
});