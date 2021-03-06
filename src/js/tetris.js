define(['events', 'collisions'], function(Events, Collisions){

    var LINES = 15;


    function Tetris(location){
        this.type = 'objective';

        this.blocks = [];
        var i = 10;
        while(i--){
            this.blocks.push({type:'collectable', location:[i-5, 0]});
            this.blocks.push({type:'collectable', location:[i-5, 1]});
        }
         
        this.collisions = new Collisions();

        this.cash = 0;
        this.rotation = 0;
        this.movement = [0, 0];
        this.pickup = false;
        this.id = 0;
        this.events = new Events();
        this.location = location.slice();
        this.isAlive = true;
        this.messageQueue = [];
        this.pieces = [];

        this.lastUpdated = Date.now();

        
        var boardBlocks = [];
        i = 10;
        var j;
        while(i--){
            j = LINES;
            while(j--){
                boardBlocks.push({type:'tetris-board', location:[i-5, j]});    
            }
        }

        
        this.counter = {
            count: 0
        };

        boardBlocks.push({type:'counter', location:[5, -2], counter:this.counter});

        this.board = {
            location:[0, 2],
            blocks:boardBlocks,
            rotation:0,
        };
    }

    Tetris.prototype.update = function() {
        var output = this.messageQueue;
        this.messageQueue = [];

        this._checkLine();
        this.timedUpdate();

        if(this.counter.count === 10){
            this.events.emit('complete');
        }

        return output;
    };

    Tetris.prototype.timedUpdate = function() {
         if(Date.now() - this.lastUpdated > 200){
            this.pieces.forEach(function(piece){
                if(this._validMove(piece)){
                    piece.location[1]++;
                }
            }.bind(this));


            this.lastUpdated = Date.now();
        }
    };

    Tetris.prototype.collision = function(report) {
        if(report.collided.pickup){
            this.messageQueue.push({
                msg:'kill',
                id:report.collided.id
            });

            this._addPiece(report);
        }
    };

    Tetris.prototype.getView = function() {
        return {
            location: this.location.slice(),
            blocks: this.blocks.slice(),
            type: this.type,
            rotation:this.rotation,
            cash: this.cash,
            movement:this.movement,
            pickup:this.pickup,
            id:this.id,
            subElements:this.pieces.concat(this.board)
        }
    };

    Tetris.prototype.on = function(event, callback) {
        this.events.on(event, callback);
    };

    Tetris.prototype._checkLine = function() {
        var i = LINES;
        var allBlocks = [];
        this.pieces.forEach(function(piece){
            allBlocks = allBlocks.concat(piece.blocks.map(function(block){
                return {
                    location: [block.location[0] + piece.location[0], block.location[1] + piece.location[1]]
                };
            }));
        });
        var thisLine;
        while(i--){
            thisLine = allBlocks.filter(function(block){
                return block.location[1] === i;
            });

            if(thisLine.length > 9){
                this.pieces.forEach(function(piece){
                    piece.blocks = piece.blocks.filter(function(block){
                        return block.location[1] + piece.location[1] !== i;
                    });

                    piece.blocks.forEach(function(block){
                        if(block.location[1] + piece.location[1] < i){
                            block.location[1]++;
                        }
                    });
                });
                this.counter.count++;
            }
        }
    };

    Tetris.prototype._addPiece = function(report) {
        
        // position correctly
        var farLeft = Math.min.apply(null, report.blocks.map(function(block){
            return block.location[0];
        }));

        // keep in bounds
        while(report.collided.blocks.some(function(block){
            return block.location[0] + farLeft < -5;
        })){
            farLeft++;    
        }


        while(report.collided.blocks.some(function(block){
            return block.location[0] + farLeft >= 5;
        })){
            farLeft--;    
        }
        

        var newPiece = {
            blocks:report.collided.blocks.map(function(block){
                return{
                    type: 'tetris',
                    location:block.location.slice()
                }
            }),
            location: [farLeft, 2],
            rotation: 0
        };

        if(this._validMove(newPiece)){
            this.pieces.push(newPiece);    
        }else{
            this.pieces = [];
            this.counter.count = 0;
        }
        
    };

    Tetris.prototype._validMove = function(piece){
        var newPiece = {
            blocks:piece.blocks.slice(),
            location:[piece.location[0], piece.location[1] + 1],
            rotation:piece.rotation
        };

        var checkPiece = {
            blocks:newPiece.blocks,
            location:[newPiece.location[0] * 10, newPiece.location[1] * 10],
            rotation:newPiece.rotation
        };

        var collisions = this.collisions;

        var otherPieces = this.pieces.filter(function(p){
            return p !== piece;
        });

        var freeSpace = !otherPieces.some(function(piece){
            var checkP = {
                blocks:piece.blocks,
                location:[piece.location[0] * 10, piece.location[1] * 10],
                rotation:piece.rotation
            };

            var collision = collisions.check(checkP, checkPiece);

            return !!collision;
        });

        return freeSpace && piece.blocks.every(function(block){
            return newPiece.location[1] + block.location[1] <= LINES + 1;
        });
    };

    return Tetris;
});