define(['smallElementFactory', 'events'], function(smallElementFactory, Events) {

    var events = new Events();

    var mainObjective;

    // position of objective
    var targetLocation = [6500, -10000];
    // targetLocation = [200, 200];
    var startLocation = [0, 0];

    var r2 = Math.PI/2;
    var r3 = Math.PI;
    var r4 = Math.PI * 1.5;

    var boxBlocks = function(){
        return [
            {location: [0, 0], type:'structure'},
            {location: [1, 0], type:'structure'},
            {location: [2, 0], type:'structure'},
            {location: [3, 0], type:'structure'},
            {location: [0, 1], type:'structure'},
            {location: [1, 1], type:'structure'},
            {location: [2, 1], type:'structure'},
            {location: [3, 1], type:'structure'},
            {location: [0, 2], type:'structure'},
            {location: [1, 2], type:'structure'},
            {location: [2, 2], type:'structure'},
            {location: [3, 2], type:'structure'},
            {location: [0, 3], type:'structure'},
            {location: [1, 3], type:'structure'},
            {location: [2, 3], type:'structure'},
            {location: [3, 3], type:'structure'}
        ];
    };

    var cornerBlocks = function(){
        return [
            {location: [0, 0], type:'structure'},
            {location: [1, 0], type:'structure'},
            {location: [0, 1], type:'structure'},
            {location: [2, 0], type:'structure'},
            {location: [0, 2], type:'structure'}
        ];
    };

    var wallBlocks = function(){
        return [
            {location: [0, 0], type:'structure'},
            {location: [1, 0], type:'structure'},
            {location: [2, 0], type:'structure'},
            {location: [3, 0], type:'structure'},
            {location: [4, 0], type:'structure'},
            {location: [5, 0], type:'structure'},
            {location: [6, 0], type:'structure'}
        ];
    };

    var satelliteBlocks = function(){
        return [
            {location: [0,0], type:'generator'},
            {location: [-1,0], type:'aero'},
            {location: [1,0], type:'aero'}
        ];
    };

    var structures = function(){
        return [
            smallElementFactory.getSimpleStructure([targetLocation[0]-70, targetLocation[1]-20], 0, boxBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]-70, targetLocation[1]-60], 0, boxBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]-70, targetLocation[1]+20], 0, boxBlocks()),

            smallElementFactory.getSimpleStructure([targetLocation[0]+30, targetLocation[1]-20], 0, boxBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]+30, targetLocation[1]-60], 0, boxBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]+30, targetLocation[1]+20], 0, boxBlocks()),
            
            smallElementFactory.getSimpleStructure([targetLocation[0]-100, targetLocation[1]-100], 0, cornerBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]+100, targetLocation[1]-100], r2, cornerBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]+100, targetLocation[1]+100], r3, cornerBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]-100, targetLocation[1]+100], r4, cornerBlocks()),

            smallElementFactory.getSimpleStructure([targetLocation[0]-65, targetLocation[1]-220], 0, wallBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]-65, targetLocation[1]+220], 0, wallBlocks()),

            smallElementFactory.getSimpleStructure([targetLocation[0]+5, targetLocation[1]-220], 0, wallBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]+5, targetLocation[1]+220], 0, wallBlocks()),

            smallElementFactory.getSimpleStructure([targetLocation[0]-100, targetLocation[1]-35], r2, wallBlocks()),
            smallElementFactory.getSimpleStructure([targetLocation[0]+100, targetLocation[1]-35], r2, wallBlocks()),


            smallElementFactory.getSatellite(targetLocation, 140, 0, satelliteBlocks()),
            smallElementFactory.getSatellite(targetLocation, 140, r3, satelliteBlocks())
        ];
    };

    var proximityEvents = [
        {
            done:false,
            pos:[0,0],
            check:function(pos){
                var minR = 600;
                this.pos = pos.slice();
                return !this.done && (Math.abs(pos[0] - targetLocation[0]) < minR && Math.abs(pos[1] - targetLocation[1]) < minR);
            },
            execute:function(){
                

                // space bus
                var bus = smallElementFactory.getSpaceBus([targetLocation[0] - 250, targetLocation[1] - 250], r3 + 0.02, [-1.5, 4], 1000);
                var bus2 = smallElementFactory.getSimpleFedShip([this.pos[0] - 250, this.pos[1] - 20], r2, [6, -2.2], 1000);
                this.done = true;
                return [{
                    msg: 'add-elements',
                    elements: [bus, bus2]
                }];
            }
        },
        {
            done:false,
            pos:[0,0],
            check:function(pos){
                var minR = 200;
                this.pos = pos.slice();
                return !this.done && (Math.abs(pos[0] - targetLocation[0]) < minR && Math.abs(pos[1] - targetLocation[1]) < minR);
            },
            execute:function(){
                this.done = true;
                level0.messageQueue.push({
                    message: 'dock at station',
                    color: 'white',
                    position: [135, 175],
                    font: 15
                })
                return [];
            }
        }
    ];

    var level0 = {
        started: false,
        objectiveAvailable: false,
        hud:{
            cash: false,
            objectives: false
        },
        menu: {
            msg: 'Space-port',
            options: [
            {
                type: 'continue'
            }]
        },
        messageQueue: [],
        eventQueue:[],
        messages: {
            20: {
                message: 'hold ↑',
                color: 'white',
                position: [180, 250],
                font: 15
            },
            300: {
                message: '← and → steer ship',
                color: 'white',
                position: [140, 250],
                font: 15
            },
            650: {
                message: 'Based on a game by Ben Brunton',
                color: 'white',
                position: [80, 150],
                font: 15
            },
            950: {
                message: 'Programming and Graphics - Ben Brunton',
                color: 'white',
                position: [80, 150],
                font: 15
            },
            1250: {
                message: 'Level Design - Ben Brunton',
                color: 'white',
                position: [100, 150],
                font: 15
            },
            1550: {
                message: 'Sound and Music - Ben Brunton',
                color: 'white',
                position: [80, 150],
                font: 15
            },
            1900: {
                message: 'Ben Brunton presents',
                color: 'white',
                position: [110, 250],
                font: 15
            },
            2200: {
                message: 'GENERIC SPACE GAME',
                color: 'white',
                position: [10, 120],
                font: 22
            },
            3200: {
                message: 'Follow the yellow arrow',
                color: 'yellow',
                position: [120, 250],
                font: 15
            }
        },
        events: {
            // post title reveal - 2600 / 2650
            2500: {

                execute: function(playerView) {
                    var location = playerView.location;
                    location[1] -= 50;
                    location[1] -= 200;
                    var rebelShip = smallElementFactory.getSimpleRebelShip(location, Math.PI, [-0.5, 4.4], 1000);
                    rebelShip.type = 'ignore';
                    return [{
                        msg: 'add-elements',
                        elements: rebelShip
                    }];
                }
            },

            2550: {
               execute: function(playerView) {
                    var location = playerView.location;
                    location[1] -= 220;
                    location[0] -= 30;
                    var elements = [];
                    var federationShip = smallElementFactory.getSimpleFedShip(location, 1.1 * Math.PI, [-0.9, 6.4], 1000);
                    federationShip.type = 'ignore';
                    elements.push(federationShip);
                    return [
                        {
                            msg: 'add-elements',
                            elements: elements
                        },
                        {
                            msg: 'standard-player-fire',
                            pos: [location[0] + 10, location[1] + 10], 
                            rotation: 1.1 * Math.PI,
                            movement: [-0.1, 0]
                        },
                        {
                            msg: 'standard-player-fire',
                            pos:  [location[0] + 10, location[1] + 50],
                            rotation: 1.1 * Math.PI,
                            movement: [-0.1, 1]
                        },
                        {
                            msg: 'standard-player-fire',
                            pos: [location[0] + 10, location[1] + 120],
                            rotation: 1.1 * Math.PI,
                            movement: [-0.1, 2]
                        }
                    ];
                }
            },

            2850: {
               execute: function(playerView) {
                    var location1 = playerView.location.slice();
                    var location2 = playerView.location.slice();
                    location1[0] -= 210;
                    location1[1] -= 60;
                    
                    location2[0] -= 210;
                    location2[1] += 60;
                    
                    var elements = [];
                    var federationShip1 = smallElementFactory.getSimpleFedShip(location1, 0.5 * Math.PI, [7, 0], 1000);
                    var federationShip2 = smallElementFactory.getSimpleFedShip(location2, 0.5 * Math.PI, [7, 0.1], 1000);
                    elements.push(federationShip1);
                    elements.push(federationShip2);
                    return [
                        {
                            msg: 'add-elements',
                            elements: elements
                        }
                    ];
                }
            },

            2990: {
                execute:function(){
                    level0.hud.objectives = true;
                    return [];
                }
            },

            3000: {
                execute:function(playerView){
                    if(!level0.objectiveAvailable){
                        level0.createObjective(playerView.location);
                    }
                    return [];
                }
            },

            3100: {
                execute: function(playerView){
                    
                    var location1 = playerView.location.slice();
                    var location2 = playerView.location.slice();
                    var location3 = playerView.location.slice();
                    location1[0] -= 210;
                    location1[1] += 200;
                    
                    location2[0] -= 245;
                    location2[1] += 155;

                    location3[0] -= 190;
                    location3[1] += 140;
                    
                    var elements = [];
                    var federationShip1 = smallElementFactory.getSimpleFedShip(location1, 0.3 * Math.PI, [4, -6], 1000);
                    var federationShip2 = smallElementFactory.getSimpleFedShip(location2, 0.3 * Math.PI, [4.2, -6.2], 1000);
                    var federationShip3 = smallElementFactory.getSimpleFedShip(location3, 0.3 * Math.PI, [3.9, -5.9], 1000);
                    federationShip1.type = 'ignore';
                    federationShip2.type = 'ignore';
                    federationShip3.type = 'ignore';

                    elements.push(federationShip1);
                    elements.push(federationShip2);
                    elements.push(federationShip3);
                    return [
                        {
                            msg: 'add-elements',
                            elements: elements
                        }
                    ];
                }
            },

            3150: {
                execute: function(playerView){
                    var location = playerView.location.slice();
                    location[0] -= 150;
                    location[1] -= 150;
                    return [
                        {
                            msg: 'explosion',
                            location: location,
                            size: 40
                        }
                    ];
                }
            },

            3155: {
                execute: function(playerView){
                    var location = playerView.location.slice();
                    
                    location[0] += 40;
                    location[1] -= 100;
                    return [
                        {
                            msg: 'explosion',
                            location: location,
                            size: 10
                        }
                    ];
                }
            },

            3170: {
                execute: function(playerView){
                    var location = playerView.location.slice();
                    location[0] -= 40;
                    location[1] -= 100;
                    return [
                        {
                            msg: 'explosion',
                            location: location,
                            size: 15
                        }
                    ];
                }
            },

            3182: {
                execute: function(playerView){
                    var location = playerView.location.slice();
                    location[0] += 23;
                    location[1] += 100;
                    return [
                        {
                            msg: 'explosion',
                            location: location,
                            size: 25
                        }
                    ];
                }
            },


            3300: {
                execute: function(playerView){
                    var location = playerView.location.slice();
                    location[1] -= 300;
                    location[0] += 100;
                    var asteroids = smallElementFactory.getAsteroidField(7, 100, location);
                    return [
                        {
                            msg: 'add-elements',
                            elements: asteroids
                        }
                    ];
                }
            },

            3800: {
                execute: function(playerView){
                    var location = playerView.location.slice();
                    location[1] -= 300;
                    location[0] += 100;
                    var asteroids = smallElementFactory.getAsteroidField(10, 120, location);
                    return [
                        {
                            msg: 'add-elements',
                            elements: asteroids
                        }
                    ];
                }
            },

            preview: {
               execute: function(playerView) {
                    var location = playerView.location;
                    location[1] -= 200;
                    location[0] -= 30;
                    var elements = [];
                    var federationShip = smallElementFactory.getSimpleFedShip(location, Math.PI, [0, 0], 1000);
                    location = [location[0] + 50, location[1]];
                    var rebelShip = smallElementFactory.getSimpleRebelShip(location, Math.PI, [0, 0], 1000);
                    elements.push(federationShip);
                    elements.push(rebelShip);
                    return [{
                        msg: 'add-elements',
                        elements: elements
                    }];
                } 
            }
        },

        setup: function() {
            

            if(!level0.started){
                level0.hud.objectives = false;
            }else{
                level0.messages = {};
                level0.events = {};
                startLocation = [targetLocation[0]/2, targetLocation[1]/2]; // move closer to the end
                level0.hud.objectives = true;
                level0.createObjective(startLocation);
                level0.messageQueue.push({
                    message: 'Follow the yellow arrow',
                    color: 'yellow',
                    position: [120, 250],
                    font: 15
                });
            }

            level0.started = true;

            return {
                elements: [],
                playerLocation: startLocation.slice()
            };
        },

        createObjective: function(pos){
            targetLocation = [pos[0] + 1000, pos[1] - 1500];
            var x = smallElementFactory.getSimpleObjective(targetLocation);
            var elements = [x];
            var complete = false;

            x.on('complete', function(){
                if(complete){
                    return;
                }
                
                events.emit('player-stop');

                setTimeout(function(){    
                    events.emit('complete');
                }, 3000);
                complete = true;

            });

            elements = elements.concat(structures());
            level0.objectiveAvailable = true;
            level0.eventQueue.push({
                    msg: 'add-elements',
                    elements: elements
            });
        },

        update:function(time, playerPos){

            var events = level0.eventQueue.slice();
            level0.eventQueue = [];

            proximityEvents.forEach(function(evt){
                if(evt.check(playerPos)){
                    events = events.concat(evt.execute());
                }
            });
            return events;
        },

        on: function(event, callback){
            events.on(event, callback);
        }

    };

    return level0;

});