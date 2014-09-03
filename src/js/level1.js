define(['smallElementFactory', 'events'], function(smallElementFactory, Events) {

    var events = new Events();

    var targetLocation = [-4500, -7000];

    var MAX_ELEMENTS = 15;
    var MAX_DISTANCE = 450;
    var MIN_DISTANCE = 300 * 300;

    var level1 = {
        hud:{
            cash: true,
            objectives:true
        },
        // todo - link up intros ??
        intro: {
            msg: 'begin mission',
            options: [{
                type: 'shop',
                level: 1
            }, {
                type: 'next mission'
            }]
        },
        elements: [],
        menu: {
            msg: 'mission complete...',
            options: [{
                type: 'shop',
                level: 1
            }, {
                type: 'continue'
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
        update:function(time, playerPos){

            // kill elements that are too far away
            level1.elements.forEach(function(element){
                var v = element.getView().location;
                var dx = v[0] - playerPos[0];
                var dy = v[1] - playerPos[1];
                if(dx * dx + dy * dy > MAX_DISTANCE * MAX_DISTANCE){
                    element.isAlive = false;
                }
            });
            
            // remove dead elements            
            level1.elements = level1.elements.filter(function(element){
                return element.isAlive;
            });
            
            // create new elements
            var newElements = MAX_ELEMENTS - level1.elements.length;
            var asteroids = [];
            while(asteroids.length < newElements){
                var x = playerPos[0] + Math.round(Math.random() * MAX_DISTANCE) * (Math.random() > 0.5 ? -1 : 1);
                var y = playerPos[1] + Math.round(Math.random() * MAX_DISTANCE) * (Math.random() > 0.5 ? -1 : 1);

                var dx = x - playerPos[0];
                var dy = y - playerPos[1];

                var distance = dx * dx + dy * dy;
                if(distance < MIN_DISTANCE){
                    continue;
                }

                var location = [x, y];

                asteroids = asteroids.concat(smallElementFactory.getAsteroidField(1, 1, location));

            }
            

            // add to messages and elements array
            level1.elements = level1.elements.concat(asteroids);
            var returnArray = [];
            if(asteroids.length > 0){
                returnArray.push({
                    msg: 'add-elements',
                    elements: asteroids
                });
            }

            return returnArray;
            
        },
        events: {},
        proximityMessages: {},
        proximityEvents: {},
        setup: function() {
            var elements = [];
            var x = smallElementFactory.getSimpleObjective(targetLocation);
            elements.push(x);

            x.on('complete', function(){
                events.emit('complete');
            });

            // elements = elements.concat(smallElementFactory.getCoins(100, 6000, [0, 0]));
            // elements = elements.concat(smallElementFactory.getAsteroidField(40, 8000, targetLocation));
            // elements.push(x);

            return {
                elements: elements,
                playerLocation: [0, 0]
            };
        },
        on: function(event, callback){
            events.on(event, callback);
        }
    };

    return level1;
});