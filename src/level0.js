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

