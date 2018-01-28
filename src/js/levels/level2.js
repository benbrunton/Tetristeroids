/*
    todo
    - tetrisify level
    --- collect items
      --- player can carry items
      --- collectable items look interesting
    --- drop off in connected way
    --- add bad guys





    -- tidy up the surrounding area by doing some tetris
    -- dynamically generate tetris pieces and clear up
    -- need to get 10 lines
 */

define(['events', 'smallElementFactory', 'enemies/badFighter', 'tetris'], function(Events, smallElementFactory, BadFighter, Tetris){
    var events = new Events();
    var startLocation = [0, 0];

    var location1 = [100, 100];
    var location2 = [1000, -2350];
    var location3 = [-2300, -1350];
    var location4 = [3200, 3350];


    var dropoffPoint = [0, 100];

    var MAX_DISTANCE = 450;
    var MIN_DISTANCE = 300 * 300;


    function tetrisShape(location){
        var blocks = [
            [
                {type:'structure', location:[0, 0]},
                {type:'structure', location:[0, -1]},
                {type:'structure', location:[-1, 0]},
                {type:'structure', location:[1, 0]}
            ],
            [
                {type:'structure', location:[0, 0]},
                {type:'structure', location:[0, -1]},
                {type:'structure', location:[-1, -1]},
                {type:'structure', location:[0, 1]}
            ],
            [
                {type:'structure', location:[0, 0]},
                {type:'structure', location:[0, -1]},
                {type:'structure', location:[1, -1]},
                {type:'structure', location:[0, 1]}
            ],
            [
                {type:'structure', location:[0, 0]},
                {type:'structure', location:[1, 0]},
                {type:'structure', location:[0, 1]},
                {type:'structure', location:[1, 1]}
            ],
            [
                {type:'structure', location:[0, 0]},
                {type:'structure', location:[-1, 0]},
                {type:'structure', location:[0, 1]},
                {type:'structure', location:[1, 1]}
            ],
            [
                {type:'structure', location:[0, 0]},
                {type:'structure', location:[0, 1]},
                {type:'structure', location:[0, 2]},
                {type:'structure', location:[0, 3]}
            ],
            [
                {type:'structure', location:[0, 0]},
                {type:'structure', location:[1, 0]},
                {type:'structure', location:[0, 1]},
                {type:'structure', location:[-1, 1]}
            ]
        ];

        var type = Math.floor(blocks.length * Math.random());
        var element = smallElementFactory.getCollectable(location);
        element.type = 'tetris';
        element.blocks = blocks[type];
        element.rotation = Math.random() * (Math.PI * 2);

        return element;
    }

    var level2 = {
        blocks:[],
        hud:{
            cash: true,
            objectives: true
        },
        intro: {
            msg: 'begin mission',
            options: [{
                type: 'shop',
                level: 2
            }, {
                type: 'next mission'
            }]
        },
        menu: {
            msg: 'mission complete...',
            options: [{
                type: 'continue'
            }]
        },
        eventQueue: [],
        messageQueue:[],
        messages:{
            20: {
                message: 'harvest the blocks',
                color: 'yellow',
                position: [110, 30],
                font: 18
            }
        },

        setup: function(){

            var dropoff = new Tetris(dropoffPoint);//smallElementFactory.getSimpleObjective(dropoffPoint);

            level2.eventQueue = [];

            
            dropoff.on('complete', function(){
                
                
            });

            var fighter1 = new BadFighter([location1[0], location1[1] - 100], 0);

            var elements = [];
            //elements.push(fighter1);
            elements.push(dropoff);

            return {
                elements: elements,
                playerLocation: startLocation
            };
        },

        update:function(time, playerPos){

            // kill elements that are too far away
            level2.blocks.forEach(function(element){
                var v = element.getView().location;
                var dx = v[0] - playerPos[0];
                var dy = v[1] - playerPos[1];
                if(dx * dx + dy * dy > MAX_DISTANCE * MAX_DISTANCE){
                    element.isAlive = false;
                }
            });

            // remove dead elements            
            level2.blocks = level2.blocks.filter(function(element){
                return element.isAlive;
            });


            var min_blocks = 20;

            var messages = level2.eventQueue.slice();

            var newElements = min_blocks - level2.blocks.length;
            var blocks = [];
            while(blocks.length < newElements){
                var x = playerPos[0] + Math.round(Math.random() * MAX_DISTANCE) * (Math.random() > 0.5 ? -1 : 1);
                var y = playerPos[1] + Math.round(Math.random() * MAX_DISTANCE) * (Math.random() > 0.5 ? -1 : 1);

                var dx = x - playerPos[0];
                var dy = y - playerPos[1];

                var distance = dx * dx + dy * dy;
                // if(distance < MIN_DISTANCE){
                //     continue;
                // }

                var location = [x, y];
                blocks.push(tetrisShape(location));

            }
            

            // add to messages and elements array
            level2.blocks = level2.blocks.concat(blocks);
            
            if(blocks.length > 0){
                messages.push({
                    msg: 'add-elements',
                    elements: blocks
                });
            }

            level2.eventQueue = [];
            return messages;
        },
        on: function(event, callback){
            events.on(event, callback);
        }
    };

    return level2;
});