define(['shipBase'], function(ShipBase){

    function SimpleShip(location, rotation){
        this.location = location;
        this.blocks = [];
        this.type = 'simpleShip';
        this.rotation = rotation;
        this.cash = 0;
        this.messageQueue = [];
        this.isAlive = true;
    }

    SimpleShip.prototype = new ShipBase();
    SimpleShip.prototype.constructor = SimpleShip;

    return SimpleShip;
});