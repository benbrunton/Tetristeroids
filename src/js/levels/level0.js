define(['smallElementFactory', 'events'], function(smallElementFactory, Events) {

    var events = new Events();

    // position of objective
    var targetLocation = [8500, -10000];
    var startLocation = [0, 0];

    var r2 = Math.PI/2;
    var r3 = Math.PI;
    var r4 = Math.PI * 1.5;

    var cornerBlocks = [
        {location: [0, 0], type:'structure'},
        {location: [1, 0], type:'structure'},
        {location: [0, 1], type:'structure'},
        {location: [2, 0], type:'structure'},
        {location: [0, 2], type:'structure'}
    ];

    var wallBlocks = [
        {location: [0, 0], type:'structure'},
        {location: [1, 0], type:'structure'},
        {location: [2, 0], type:'structure'},
        {location: [3, 0], type:'structure'},
        {location: [4, 0], type:'structure'},
        {location: [5, 0], type:'structure'},
        {location: [6, 0], type:'structure'}
    ];

    var satelliteBlocks = [
        {location: [0,0], type:'generator'},
        {location: [-1,0], type:'aero'},
        {location: [1,0], type:'aero'}
    ];

    var structures = [
        smallElementFactory.getSimpleStructure([targetLocation[0]-100, targetLocation[1]-100], 0, cornerBlocks.slice()),
        smallElementFactory.getSimpleStructure([targetLocation[0]+100, targetLocation[1]-100], r2, cornerBlocks.slice()),
        smallElementFactory.getSimpleStructure([targetLocation[0]+100, targetLocation[1]+100], r3, cornerBlocks.slice()),
        smallElementFactory.getSimpleStructure([targetLocation[0]-100, targetLocation[1]+100], r4, cornerBlocks.slice()),

        smallElementFactory.getSimpleStructure([targetLocation[0]-35, targetLocation[1]-100], 0, wallBlocks.slice()),
        smallElementFactory.getSimpleStructure([targetLocation[0]-100, targetLocation[1]-35], r2, wallBlocks.slice()),
        smallElementFactory.getSimpleStructure([targetLocation[0]-35, targetLocation[1]+100], 0, wallBlocks.slice()),
        smallElementFactory.getSimpleStructure([targetLocation[0]+100, targetLocation[1]-35], r2, wallBlocks.slice()),


        smallElementFactory.getSatellite(targetLocation, 140, 0, satelliteBlocks),
        smallElementFactory.getSatellite(targetLocation, 140, r3, satelliteBlocks)
    ];

    var level0 = {
        started: false,
        hud:{
            cash: false,
            objectives: false
        },
        menu: {
            msg: 'Space-port',
            options: [
            // {
            //     type: 'shop',
            //     level: 1
            // }, 
            {
                type: 'continue'
            }]
        },
        messageQueue: [],
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
                message: 'based on a game by Ben Brunton',
                color: 'white',
                position: [80, 150],
                font: 15
            },
            950: {
                message: 'programming and graphics - Ben Brunton',
                color: 'white',
                position: [80, 150],
                font: 15
            },
            1250: {
                message: 'level design - Ben Brunton',
                color: 'white',
                position: [100, 150],
                font: 15
            },
            1550: {
                message: 'sound and music - Ben Brunton',
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
                message: 'follow the yellow arrow',
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
                            pos: [location[0], location[1] - 20], 
                            rotation: 1.1 * Math.PI,
                            movement: [-0.1, 0]
                        },
                        {
                            msg: 'standard-player-fire',
                            pos: location.slice(),
                            rotation: 1.1 * Math.PI,
                            movement: [-0.1, 1]
                        },
                        {
                            msg: 'standard-player-fire',
                            pos: location.slice(),
                            rotation: 1.1 * Math.PI,
                            movement: [-0.1, 4]
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

            3200: {
                execute: function(playerView){
                    level0.hud.objectives = true;
                    return [];
                }
            },

            preview: {
               execute: function(playerView) {
                    var location = playerView.location;
                    location[1] -= 200;
                    location[0] -= 30;
                    var elements = [];
                    // add gunfire
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

        proximityMessages: {

        },

        proximityEvents: {

        },
        setup: function() {
            var x = smallElementFactory.getSimpleObjective(targetLocation);
            var elements = [x];

            var complete = false;


            x.on('complete', function(){
                if(complete){
                    return;
                }

                this.messageQueue.push({
                    message: 'mission complete',
                    color: 'white',
                    position: [105, 175],
                    font: 25
                });

                events.emit('player-stop');

                setTimeout(function(){    
                    events.emit('complete');
                }, 3000);
                complete = true;

            }.bind(this));

            elements = elements.concat(structures);

            //elements = elements.concat(smallElementFactory.getAsteroidField(50, 600, targetLocation));
            if(!level0.started){
                level0.hud.objectives = false;
            }else{
                level0.messages = {};
                level0.events = {};
                startLocation = [7500, -8000];
                level0.hud.objectives = true;
            }

            level0.started = true;

            return {
                elements: elements,
                playerLocation: startLocation
            };
        },
        on: function(event, callback){
            events.on(event, callback);
        }

    };

    return level0;

});