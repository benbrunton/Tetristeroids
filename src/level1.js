define(['smallElementFactory'], function(smallElementFactory) {
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
            elements = elements.concat(smallElementFactory.getCoins(100, 6000, [0, 0]));
            return {
                elements: elements,
                playerLocation: [0, 0]
            };
        }
    }
});