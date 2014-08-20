define(['smallElementFactory'], function(smallElementFactory) {

    return {
        menu: {
            msg: 'you\'ve reached the start of the game...',
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
                position: [180, 250],
                font: 15
            },
            300: {
                message: '← and → steer ship',
                position: [140, 250],
                font: 15
            },
            650: {
                message: 'based on a game by Ben Brunton',
                position: [80, 150],
                font: 15
            },
            950: {
                message: 'programming and graphics - Ben Brunton',
                position: [80, 150],
                font: 15
            },
            1250: {
                message: 'level design - Ben Brunton',
                position: [100, 150],
                font: 15
            },
            1550: {
                message: 'sound and music - Ben Brunton',
                position: [80, 150],
                font: 15
            },
            1800: {
                message: 'Ben Brunton presents',
                position: [110, 250],
                font: 15
            },
            2200: {
                message: 'WORKING PROGRESS GAME TITLE',
                position: [10, 120],
                font: 22
            }
        },
        events: {
            // post title reveal
            2600: {

                execute: function(playerView) {
                    var elements = smallElementFactory.getCoins(10, 100, playerView.location);
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
            var targetLocation = [20000, -45000];
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