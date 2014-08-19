var level0 = {
    menu : {
        msg: 'you\'ve reached the start of the game...',
        options: [
            {
                type:'shop', level:1
            },
            {
                type:'next mission'
            }
        ]
    },
    messages:{
        100: {
            message: 'Space Rebel',
            position:[120, 150],
            font: 35
        },
        250: {
            message: 'an html5 game by Ben Brunton',
            position:[60, 190],
            font: 20
        }
    },
    setup: function(){
        console.log('level 0 setup');

        var targetLocation = [100, 100];// [8000, -36000];
        var x = smallElementFactory.getSimpleObjective(targetLocation);

        var elements = [x];

        elements = elements.concat(smallElementFactory.getCoins(20, 500, targetLocation));
        

        return {
            elements: elements,
            playerLocation:[0, 0]
        };
    }
};