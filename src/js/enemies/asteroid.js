define(['shipBase'], function(ShipBase){

    var MAX_SIZE = 5 * 5;
    var MAX_MOVEMENT = 3;
    var POSITIONS = [
        [0, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
        [1, 0], // 5
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [0, -2], // 10
        [-1, -2],
        [-2, 0],
        [-2, -1],
        [-2, 1], //15
        [-1, 2],
        [0, 2],
        [1, 2],
        [1, -2],
        [2, 0], //20
        [2, -1],
        [2, 1],
        [-2, -2],
        [2, -2],
        [2, 2] //25
    ];

    function Asteroid(location){
        this.location = location;
        this.blocks = this._generateBlocks();
        this.type = 'asteroid';
        this.rotation = Math.random() * Math.PI * 2;
        this.cash = 0;
        this.messageQueue = [];
        this.isAlive = true;
        this.movement = [this._doubleRandom(MAX_MOVEMENT), this._doubleRandom(MAX_MOVEMENT)];
    }

    Asteroid.prototype = new ShipBase();
    Asteroid.prototype.constructor = Asteroid;

    Asteroid.prototype.collision = function(report){
        this.blocks = this.blocks.filter(function(block){
            return !report.blocks.some(function(b){
                return b.location[0] === block.location[0] && b.location[1] === block.location[1];
            });
        });

        this.messageQueue.push({
            msg: 'explosion',
            location: this.location,
            size: this.blocks.length
        });

        // crap physics
        var cBlocks = report.collided.blocks.length;
        if(cBlocks > this.blocks.length){
            this.movement[0] = report.collided.movement[0] * Math.max(report.collided.blocks.length - this.blocks.length, 0) / 10;
            this.movement[1] = report.collided.movement[1] * Math.max(report.collided.blocks.length - this.blocks.length, 0) / 10;
        }

        if(this.blocks.length < 1){
            this.isAlive = false;
        }
    }

    Asteroid.prototype._generateBlocks = function(){
        var size = Math.floor(Math.random() * MAX_SIZE);
        var blocks = [];

        var i = 0;
        while(i < size){
            blocks.push({
                location:POSITIONS[i].slice(),
                type: 'asteroid'
            });
            i++;
        }

        return blocks;
    };

    Asteroid.prototype._doubleRandom = function(n) {
        var sign = Math.random() > 0.5 ? 1 : -1;
        return Math.random() * n * sign;
    };

    return Asteroid;
});