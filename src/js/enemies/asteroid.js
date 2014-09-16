define(['shipBase', 'connectedBlocks'], function(ShipBase, ConnectedBlocks){

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
        this.connectedBlocks = new ConnectedBlocks();
    }

    Asteroid.prototype = new ShipBase();
    Asteroid.prototype.constructor = Asteroid;

    Asteroid.prototype.collision = function(report){
        var blockCount = this.blocks.length;
        this.blocks.forEach(function(block){
            if(report.blocks.some(function(b){
                return b.location[0] === block.location[0] && b.location[1] === block.location[1];
            })){
                if(!isNaN(block.damage)){
                    block.damage--;
                }
            }
        });

        this.blocks = this.blocks.filter(function(block){
            return block.damage > -1;
        })



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
            return;
        }

        if(blockCount > this.blocks.length){
            this._recalculate();
        }
    }

    Asteroid.prototype._generateBlocks = function(){
        var size = Math.floor(Math.random() * MAX_SIZE);
        var blocks = [];

        var i = 0;
        while(i < size){
            blocks.push({
                location:POSITIONS[i].slice(),
                type: 'asteroid',
                damage: 0
            });
            i++;
        }

        return blocks;
    };

    Asteroid.prototype._doubleRandom = function(n) {
        var sign = Math.random() > 0.5 ? 1 : -1;
        return Math.random() * n * sign;
    };

    Asteroid.prototype._getBlockLocation = function(loc){
        var s = Math.sin(this.rotation);
        var c = Math.cos(this.rotation);
        var l1 = loc[0] * 10;
        var l2 = loc[1] * 10;
        var x1 = this.location[0] + this.movement[0];
        var y1 = this.location[1] + this.movement[1];
        var x2 = c * l1 - s * l2;
        var y2 = s * l1 + c * l2;
        return [x1 + x2, y1 + y2];
    };

    Asteroid.prototype._recalculate = function() {
        var blocks = this.connectedBlocks.check(this.blocks);

        var elements = blocks.unconnected.map(function(block){
            var location = this._getBlockLocation(block.location);
            var newBlock = {
                location: [0,0],
                type:'asteroid'
            };
            var ast = new Asteroid(location);
            ast.blocks = [newBlock];
            return ast;
        }.bind(this));

        this.messageQueue.push({
            msg: 'add-elements',
            elements: elements
        });

        this.blocks = blocks.connected;

    };


    return Asteroid;
});