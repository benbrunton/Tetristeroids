/*
    todo
    - tetrisify level
    --- collect items
      --- player can carry items
      --- collectable items look interesting
    --- drop off in connected way
    --- add bad guys
 */

define(['events', 'smallElementFactory', 'enemies/badFighter'], function(Events, smallElementFactory, BadFighter){
    var events = new Events();
    var startLocation = [0, 0];

    var location1 = [2000, 1350];
    var location2 = [1000, -2350];
    var location3 = [-2300, -1350];
    var location4 = [3200, 3350];


    var dropoffPoint = [0, -100];

    var level2 = {
        hud:{
            cash: true,
            objectives: true
        },
        intro: {
            msg: 'begin mission',
            options: [{
                type: 'shop',
                level: 1
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
        messages:{},
        setup: function(){

            // var collectable1 = smallElementFactory.getCollectable(location1);
            // collectable1.blocks = [
            //     {type:'structure', location:[0, 0]}
            // ];

            var elements = [];
            var collectables = [
                smallElementFactory.getCollectable(location1),
                smallElementFactory.getCollectable(location2),
                smallElementFactory.getCollectable(location3),
                smallElementFactory.getCollectable(location4)
            ];
            var currentCollectable = 0;
            var dropoff = smallElementFactory.getSimpleObjective(dropoffPoint);

            level2.eventQueue = [];

            collectables.forEach(function(collectable){
                
                collectable.on('complete', function(){
                    // setTimeout(function(){
                    //     collectable.isAlive = false;
                    // },50);
                    dropoff.type = 'objective';
                });
            });
            

            dropoff.type = 'ignore';
            dropoff.on('complete', function(){
                dropoff.type = 'ignore';
                currentCollectable++;
                if(collectables[currentCollectable]){
                    level2.eventQueue.push({
                        msg: 'add-elements',
                        elements: collectables[currentCollectable]
                    });
                }else{
                    events.emit('complete');
                }
            });

            var fighter1 = new BadFighter([location1[0], location1[1] - 100], 0);


            elements.push(collectables[0]);
            elements.push(fighter1);
            elements.push(dropoff);

            return {
                elements: elements,
                playerLocation: startLocation
            };
        },

        update:function(time, playerPos){

            var messages = level2.eventQueue.slice();
            level2.eventQueue = [];
            return messages;
        },
        on: function(event, callback){
            events.on(event, callback);
        }
    };

    return level2;
});