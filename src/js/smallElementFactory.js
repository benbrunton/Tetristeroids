define(['enemies/simpleShip', 'enemies/asteroid', 'events'], function(SimpleShip, Asteroid, Events){

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
            var blocks = [];
            var i = 4;
            var j;
            while (i--){
                j = 4;
                while(j--){
                    blocks.push({
                        type:'planet',
                        location:[i - 2, j - 2]
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
                }
            };
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