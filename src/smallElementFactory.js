define(['enemies/simpleShip', 'enemies/asteroid'], function(SimpleShip, Asteroid){

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

            return {
                messageQueue:[],
                isAlive:true,
                blocks:blocks,
                update: function(){
                    var messages = this.messageQueue;
                    this.messageQueue = [];
                    return messages;
                },
                collision: function(report){
                    if(report.collided.type === 'player'){
                        this.messageQueue.push({msg:'level-complete'});
                    }
                },
                getView: function(){
                    return {
                        type: 'objective',
                        location:pos,
                        message: 'get to outpost',
                        blocks: this.blocks
                    };
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
            value: this.value
        };
    };

    return smallElementFactory;
});