define(['shipBase'], function(ShipBase){

    var MAX_SIZE = 5 * 5;
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
        this.movement = [0, 0];
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

    return Asteroid;
});