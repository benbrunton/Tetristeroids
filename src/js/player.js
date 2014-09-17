define(['shipBase', 'connectedBlocks', 'enemies/simpleShip'], function(ShipBase, ConnectedBlocks, SimpleShip){

    function Player(){
        
        this.messageQueue = [];

        this.cash = 25000;

        this.lastFired = 0;
        this.stopPlayer = false;

        this.type = 'player';
        this.movement = [0, 0];
        this.location = [0, 0];
        this.rotation = 0;
        this.circularMovement = 0;
        this.max_turn = 1.5;

        this.shieldUp = false;
        this.lockShields = false;
        this.shieldCharge = 0;

        this.blocks = [
            {
                location: [0, -1], 
                type: 'bumper',
                damage: 200
            },
            {
                location: [0, 0], 
                type: 'cockpit',
                damage: 1
            },
            {
                location: [0, 1],
                type: 'engine',
                damage: 50

            },
            {
                location: [1, -1], 
                type: 'bumper',
                damage: 200
            },
            {
                location: [-1, -1], 
                type: 'bumper',
                damage: 200
            }
        ];

        this.connectedBlocks = new ConnectedBlocks();

    }

    Player.prototype = new ShipBase();
    Player.prototype.constructor = Player;

    Player.prototype.update = function(){

        if(!this.stopPlayer && (this.blocks.length < 1 || !this.blocks.some(function(block){
            return block.type === 'cockpit';
        }))){
            // game over
            this.messageQueue.push({msg:'game-over'});
            this.stopPlayer = true;
        }

        if(this.stopPlayer){
            this.movement[0] *= 0.8;
            this.movement[1] *= 0.8;
        }

        if(this.engines && Math.random() > 0.5){
            this.messageQueue = this.messageQueue.concat(
                this.blocks.filter(function(block){
                    return block.type === 'engine' && Math.random() > 0.5;
                }).map(function(block){
                    return {
                        msg:'explosion',
                        size:Math.random() * 3,
                        location: this.getBlockLocation([block.location[0], block.location[1]])
                    };
                }.bind(this))
            );
        }

        if(this.shieldUp){
            if(this.shieldCharge < 1){
                this.shieldUp = false;
                this.lockShields = true;
            }else{
                this.shieldCharge--;
            }
        }else{
            if(this.shieldCharge < this._getMaxShield()){
                this.shieldCharge++;
            }
        }


        return ShipBase.prototype.update.call(this);
    };

    Player.prototype.getView = function() {
        var v = ShipBase.prototype.getView.call(this);
        if(this.shieldUp){
            var energyBlocks = v.blocks.map(function(block){
                return {
                    type:'energy-shield',
                    location:block.location.slice()
                }
            });
            v.blocks = v.blocks.concat(energyBlocks);
        }

        v.shieldCharge = this.shieldCharge;
        v.maxShield = this._getMaxShield();

        return v;
    };


    Player.prototype.reset = function(location) {
        this.movement = [0, 0];
        this.location = location ? location.slice() : [0, 0];
        this.rotation = 0;
        this.blocks = JSON.parse(this.cachedBlocks);
        this.cash = this.cachedCash;
        this.stopPlayer = false;
        this.lockShields = false;
        this.shieldUp = false;
        this.shieldCharge = this._getMaxShield();
    };


    Player.prototype.collision = function(report) {
        if(this.stopPlayer){
            return;
        }

        if(this.shieldUp){
            return;    
        }

        switch(report.collided.type){
            case 'cash':
                this.cash += report.collided.value;
                break;
            case 'player-missile':
                break;
            default:
                var i = report.blocks.length;
                while(i--){
                    this._damageBlock(report.blocks[i]);
                }
                
                var numBlocks = this.blocks.length;
                this.blocks = this.blocks.filter(function(block){
                    return block.damage > 0;
                });

                if(this.blocks.length < numBlocks){
                    this.blocks = this._recalculateCraft();
                }
                break;
        }
    };

    Player.prototype.save = function(){
        this.cachedBlocks = JSON.stringify(this.blocks);
        this.cachedCash = this.cash;
    };

    Player.prototype.power = function() {
        var power = this.blocks.filter(function(block){
            return block.type === 'engine';
        }).length / 8;
        var d = Math.max(this.blocks.length, 1);
        return (power / d) + 0.002;
    };

    Player.prototype.max_power = function(){
        var engines = this.blocks.filter(function(block){
            return block.type === 'engine';
        }).length;

        return (engines * 3 * engines * 3) || 10;
    };

    Player.prototype.rotateAmount = function(){
        var left = 0;
        var right = 0;
        var top = 0;
        var bottom = 0;
        this.blocks.forEach(function(block){
            if(block.location[0] > right){
                right = block.location[0];
            }
            if(block.location[0] < left){
                left = block.location[0];
            }
            if(block.location[1] > bottom){
                bottom = block.location[1];
            }
            if(block.location[1] < top){
                top = block.location[1];
            }
        });
        var longestLength = Math.max(bottom - top, right - left, 1);
        return (0.2 / longestLength) + 0.00001;
    };

    Player.prototype.forward = function() {

        if(this.stopPlayer){
            return;
        }

        this.engines = true;

        var r = this.rotation;// * Math.PI / 180;
        var p = this.power();
        var newMovementX = this.movement[0] + p * Math.sin(r);
        var newMovementY = this.movement[1] - p * Math.cos(r);
        while(newMovementX * newMovementX + newMovementY * newMovementY > this.max_power()){
            newMovementX *= 0.99;
            newMovementY *= 0.99;
        }
        this.movement[0] = newMovementX;
        this.movement[1] = newMovementY;
    };

    Player.prototype.cutEngine = function(){
        this.engines = false;
    };

    Player.prototype.backward = function() {

        if(this.stopPlayer){
            return;
        }
        
        var r = this.rotation;
        var p = this.power() / 2;
        var newMovementX = this.movement[0] - p * Math.sin(r);
        var newMovementY = this.movement[1] + p * Math.cos(r);
        if(newMovementX * newMovementX + newMovementY * newMovementY < this.max_power()){
            this.movement[0] = newMovementX;
            this.movement[1] = newMovementY;
        }
    };

    Player.prototype.stop = function() {
        setTimeout(function(){
            this.stopPlayer = true;
        }.bind(this), 200);
    };

    Player.prototype.left = function() {
        if(this.stopPlayer){
            return;
        }

        this.rotation -= this.rotateAmount();
    };

    Player.prototype.right = function() {
        if(this.stopPlayer){
            return;
        }

        this.rotation += this.rotateAmount();
    };

    Player.prototype.fire = function(){
        if(Date.now() - 100 < this.lastFired){
            return;
        }
        this.blocks.filter(function(block){
                return block.type === 'standard-gun';
            })
            .forEach(function(block){
                this.messageQueue.push({msg:'standard-player-fire', pos:this.getBlockLocation(block.location), rotation:this.rotation, movement:this.movement});
            }.bind(this));

        this.lastFired = Date.now();
    };

    Player.prototype.shield = function() {
        if(this.shieldCharge > 1 && this.lockShields === false){
            this.shieldUp = true;
        }
    };

    Player.prototype.shieldDown = function() {
        this.shieldUp = false;
        this.lockShields = false;
    };

    Player.prototype.getBlockLocation = function(loc){
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

    Player.prototype._damageBlock = function(block){

        block.damage--;
        this.messageQueue.push({
            msg: 'explosion',
            location: this.getBlockLocation(block.location),
            size: Math.random() * 3
        });
    };

    Player.prototype._recalculateCraft = function() {
        var blocks = this.connectedBlocks.check(this.blocks);

        var elements = blocks.unconnected.map(function(block){
            var newBlock = {
                type: block.type,
                location: [0, 0]
            };
            var location = this.getBlockLocation(block.location);
            return new SimpleShip([newBlock], location, this.rotation, [this.movement[0] + Math.random(), this.movement[1] + Math.random()], 1000);
        }.bind(this));

        this.messageQueue.push({
            msg: 'add-elements',
            elements: elements
        });

        return blocks.connected;
        
    };


    Player.prototype._getMaxShield = function() {
        return this.blocks.filter(function(block){
            return block.type === 'shield';
        }).length * 200;
    };


    return Player;

});