define(['enemies/simpleShip', 'enemies/asteroid', 'events', 'connectedBlocks'], function(SimpleShip, Asteroid, Events, ConnectedBlocks){
    var connectedBlocks = new ConnectedBlocks();

    var smallElementFactory = {
        getCoins: function(num, range, focus){
            var elements = [];
            var maxCoins = num;
            var distanceFromTarget = range;
            var i = 0;
            var x, y, value;
            while(i++ < maxCoins){
                value = Math.floor(Math.random() * 75);
                x = Math.floor(Math.random() * distanceFromTarget - Math.random() * distanceFromTarget) + focus[0];
                y = Math.floor(Math.random() * distanceFromTarget - Math.random() * distanceFromTarget) + focus[1];

                elements.push(new Coin(value, [x, y]));
            }

            return elements;
        },
        getSimpleObjective: function(pos){
            return this.getObjective(pos, 'objective');
        },
        getCollectable: function(pos){
            return this.getObjective(pos, 'collectable');
        },
        getObjective: function(pos, type){
            var blocks = [];
            var i = 6;
            var j;
            while (i--){
                j = 6;
                while(j--){
                    blocks.push({
                        type:type,
                        location:[i - 3, j - 3]
                    });
                }
            }

            var objective = this.getSimpleElement('objective', pos, 0, blocks, true);

            objective.collision = function(report){
                if(report.collided.type === 'player'){
                    this.emit('complete');   
                }
            };

            return objective;
        },

        getSimpleStructure: function(pos, rotation, blocks){
            return this.getSimpleElement('structure', pos, rotation, blocks, false);
        },

        getSatellite: function(target, radius, offset, blocks){
            var satellite = this.getSimpleElement('satellite', [0, 0], 0, blocks, false);
            satellite.cachedUpdate = satellite.update;
            satellite.angle = offset;

            satellite.update = function(){
                this.rotation -= 0.05;
                this.angle += 0.015;

                var s = Math.sin(this.angle);
                var c = Math.cos(this.angle);
                var x2 = c * radius - s * radius;
                var y2 = s * radius + c * radius;
                this.location = [target[0] + x2, target[1] + y2];

                return this.cachedUpdate();

            };

            satellite.update();

            return satellite;
        },

        getSimpleElement: function(type, pos, rotation, blocks, noDamage){
            var events = new Events();

            return {
                messageQueue:[],
                location: pos,
                isAlive:true,
                blocks:blocks,
                type: type,
                rotation:rotation,
                update: function(){
                    var messages = this.messageQueue;
                    this.messageQueue = [];
                    return messages;
                },
                collision: function(report){
                    var blockCount = this.blocks.length;
                    this.blocks = this.blocks.filter(function(block){
                        return !report.blocks.some(function(b){
                            return b.location[0] === block.location[0] && b.location[1] === block.location[1];
                        });
                    });

                    report.blocks.forEach(function(block){
                            this.messageQueue.push({
                                msg: 'explosion',
                                location: this._getBlockLocation(block.location),
                                size: blockCount
                            });
                    }.bind(this));

                    if(this.blocks.length < blockCount){
                        var blocks = connectedBlocks.check(this.blocks);
                        var elements = blocks.unconnected.map(function(block){

                            var location = this._getBlockLocation(block.location);
                            var newBlock = {
                                location: [0,0],
                                type:block.type,
                                damage:5
                            };
                            var ast = new Asteroid(location);
                            ast.blocks = [newBlock];
                            return ast;
                        }.bind(this));
                        this.blocks = blocks.connected;

                        this.messageQueue.push({
                            msg:'add-elements',
                            elements: elements
                        })
                    }

                    
                },
                getView: function(){
                    return {
                        type:this.type,
                        location:this.location,
                        blocks: this.blocks,
                        movement:[0, 0],
                        rotation:this.rotation,
                        noDamage:noDamage
                    };
                },
                on: function(event, callback){
                    events.on(event, callback);
                },
                emit: function(type, data){
                    events.emit(type, data);
                },
                _getBlockLocation : function(loc){
                    var s = Math.sin(this.rotation);
                    var c = Math.cos(this.rotation);
                    var l1 = loc[0] * 10;
                    var l2 = loc[1] * 10;
                    var x1 = this.location[0];
                    var y1 = this.location[1];
                    var x2 = c * l1 - s * l2;
                    var y2 = s * l1 + c * l2;
                    return [x1 + x2, y1 + y2];
                }
            };
        },

        getSpaceBus: function(location, rotation, movement, maxAge){

            /*
                __ __ () __ __
                __ __ [] __ __
                __ == || == __
                __ || __ || __
                __ \/ __ \/ __
             */

            var blocks = [
                {
                    location: [0, -2],
                    type: 'shield'
                },
                {
                    location: [0, -1],
                    type: 'cockpit'
                },
                {
                    location: [0, 0],
                    type: 'solid'
                },
                {
                    location: [-1, 0],
                    type: 'aero'
                },
                {
                    location: [1, 0],
                    type: 'aero'
                },
                {
                    location: [1, 1],
                    type: 'solid'
                },
                {
                    location: [-1, 1],
                    type: 'solid'
                },
                {
                    location: [1, 2],
                    type: 'engine'
                },
                {
                    location: [-1, 2],
                    type: 'engine'
                }
            ];

            return new SimpleShip(blocks, location, rotation, movement, maxAge);
        },

        getSimpleRebelShip: function(location, rotation, movement, maxAge){
            var blocks = [
                {
                    location: [0, 0],
                    type: 'cockpit'
                },
                {
                    location: [0, -2],
                    type: 'shield'
                },
                {
                    location: [0, -1],
                    type: 'rebel-motif'
                },
                {
                    location: [0, 1],
                    type: 'engine'
                },
                {
                    location: [-1, 0],
                    type: 'solid'
                },
                {
                    location: [1, 0],
                    type: 'solid'
                }
            ];

            return new SimpleShip(blocks, location, rotation, movement, maxAge);
        },

        getSimpleFedShip: function(location, rotation, movement, maxAge){
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

            return new SimpleShip(blocks, location, rotation, movement, maxAge);
        },
        getAsteroidField: function(num, range, focus){
            var elements = [];
            var maxAsteroids = num;
            var distanceFromTarget = range;
            var i = 0;
            var x, y;
            while(i++ < maxAsteroids){
                x = Math.floor(Math.random() * distanceFromTarget - Math.random() * distanceFromTarget) + focus[0];
                y = Math.floor(Math.random() * distanceFromTarget - Math.random() * distanceFromTarget) + focus[1];

                elements.push(new Asteroid([x, y]));
            }

            return elements;
        }
    };

    function Coin(value, location){
        this.isAlive = true;
        this.location = location;
        this.value = value;
        this.rotation = 0;
        this.blocks = [{
            type:'coin',
            location:[0, 0]
        }];
    }

    Coin.prototype.update = function(){
        return [];
    };

    Coin.prototype.collision = function(report){
        if(report.collided.type === 'player'){
            this.isAlive = false;
        }
    };


    Coin.prototype.getView = function(){
        return {
            type: 'cash',
            location:this.location,
            blocks: this.blocks,
            value: this.value,
            rotation: this.rotation
        };
    };

    return smallElementFactory;
});