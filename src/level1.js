define(['smallElementFactory'], function(smallElementFactory) {
    var targetLocation = [-6000, -10000];
    return {
        hud:{
            cash: true,
            objectives:true
        },
        // todo - link up intros
        intro: {},
        menu: {
            msg: 'mission complete...',
            options: [{
                type: 'shop',
                level: 1
            }, {
                type: 'next mission'
            }]
        },
        messages: {
            20: {
                message: 'contact the resistance',
                color: 'yellow',
                position: [110, 30],
                font: 18
            },
        },
        events: {},
        proximityMessages: {},
        proximityEvents: {},
        setup: function() {
            var elements = [];
            var x = smallElementFactory.getSimpleObjective(targetLocation);

            elements = elements.concat(smallElementFactory.getCoins(100, 6000, [0, 0]));
            elements = elements.concat(smallElementFactory.getAsteroidField(40, 8000, targetLocation));
            elements.push(x);

            return {
                elements: elements,
                playerLocation: [0, 0]
            };
        }
    }
});