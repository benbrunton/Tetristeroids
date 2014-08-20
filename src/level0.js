define(['smallElementFactory'], function(smallElementFactory) {

    return {
        menu: {
            msg: 'Space-port',
            options: [{
                type: 'shop',
                level: 1
            }, {
                type: 'next mission'
            }]
        },
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
            1800: {
                message: 'Ben Brunton presents',
                color: 'white',
                position: [110, 250],
                font: 15
            },
            2200: {
                message: 'WORKING PROGRESS GAME TITLE',
                color: 'white',
                position: [10, 120],
                font: 22
            }
        },
        events: {
            // post title reveal - 2600 / 2650
            2500: {

                execute: function(playerView) {
                    var location = playerView.location;
                    location[1] -= 200;
                    var rebelShip = smallElementFactory.getSimpleRebelShip(location, Math.PI, [-0.5, 4.4], 1000);
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
                    // add gunfire
                    var federationShip = smallElementFactory.getSimpleFedShip(location, Math.PI, [-0.5, 6.4], 1000);
                    federationShip.type = 'missile';
                    elements.push(federationShip);
                    return [
                        {
                            msg: 'add-elements',
                            elements: elements
                        },
                        {
                            msg: 'standard-player-fire',
                            pos: [location[0], location[1] - 20], 
                            rotation: Math.PI,
                            movement: [-0.1, 0]
                        },
                        {
                            msg: 'standard-player-fire',
                            pos: location.slice(),
                            rotation: Math.PI,
                            movement: [-0.1, 1]
                        },
                        {
                            msg: 'standard-player-fire',
                            pos: location.slice(),
                            rotation: Math.PI,
                            movement: [-0.1, 4]
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
            var targetLocation = [10000, -15000];
            var x = smallElementFactory.getSimpleObjective(targetLocation);

            var elements = [x];

            elements = elements.concat(smallElementFactory.getCoins(20, 500, targetLocation));


            return {
                elements: elements,
                playerLocation: [0, 0]
            };
        }

    };

});