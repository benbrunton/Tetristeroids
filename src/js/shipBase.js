define(function(){

    function ShipBase(){
        this.pickup = false,
        this.id = 0;
        this.movement = [0, 0];
        this.messageQueue = [];
    }

    ShipBase.prototype.getView = function() {
        return {
            location: this.location.slice(),
            blocks: this.blocks.slice(),
            type: this.type,
            rotation:this.rotation,
            cash: this.cash,
            movement:this.movement,
            pickup:this.pickup,
            id:this.id
        };
    };

    ShipBase.prototype.update = function(){
        var messages = [];
        messages = messages.concat(this.messageQueue);
        this.messageQueue = [];

        this.location[0] += this.movement[0];
        this.location[1] += this.movement[1];

        this.movement[0] *= 0.9996;
        this.movement[1] *= 0.9996;

        if(this.blocks.length < 1){
            this.isAlive = false;
        }

        return messages;
    };

    ShipBase.prototype.collision = function(collidedWith) {};

    return ShipBase;
});