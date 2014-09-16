define(['smallElementFactory', 'events'], function(smallElementFactory, Events) {

    var events = new Events();

    var targetLocation = [-4500, -7000];

    var MAX_ELEMENTS = 25;
    var MAX_DISTANCE = 450;
    var MIN_DISTANCE = 300 * 300;

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
        setup: function() {
            var elements = [];
            var x = smallElementFactory.getSimpleObjective(targetLocation);
            elements.push(x);

            var wall1 = smallElementFactory.getSimpleStructure([targetLocation[0] - 70, targetLocation[1] - 20], 0, boxBlocks());
            elements.push(wall1);
            var wall2 = smallElementFactory.getSimpleStructure([targetLocation[0] + 70, targetLocation[1] - 20], 0, boxBlocks());
            elements.push(wall2);

            var satellite1 = smallElementFactory.getSatellite(targetLocation, 140, 0, boxBlocks());
            var satellite2 = smallElementFactory.getSatellite(targetLocation, 140, Math.PI, boxBlocks());
            elements.push(satellite1);
            elements.push(satellite2);

            var satellite3 = smallElementFactory.getSatellite(targetLocation, 240, Math.PI/2, boxBlocks());
            var satellite4 = smallElementFactory.getSatellite(targetLocation, 240, Math.PI * 1.5, boxBlocks());
            elements.push(satellite3);
            elements.push(satellite4);

            x.on('complete', function(){
                events.emit('complete');
            });

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