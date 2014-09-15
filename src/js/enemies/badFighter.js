define(['shipBase'], function(ShipBase){

    var blocks = [
        {
            location: [0, 0],
            type: 'cockpit'
        },
        {
            location: [0, -2],
            type: 'standard-gun'
        },
        {
            location: [0, -1],
            type: 'fed-motif'
        },
        {
            location: [0, 1],
            type: 'engine'
        },
        {
            location: [-1, 0],
            type: 'aero'
        },
        {
            location: [1, 0],
            type: 'aero'
        }
    ];

    function BadFighter(location, rotation){
        this.location = location.slice();
        this.blocks = blocks;

        this.type = 'ship';
        this.rotation = rotation;
        this.cash = 0;
        this.messageQueue = [];
        this.isAlive = true;
        this.movement = [0, 0];
        this.cachedMovement = [0, 0];
    }

    BadFighter.prototype = new ShipBase();
    BadFighter.prototype.constructor = BadFighter;

    BadFighter.prototype.collision = function(report){

    };

    return BadFighter;
});