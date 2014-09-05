// do a mission for the resistance
// collect and deliver
// add some bad guy ships

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
        messageQueue: [],
        messages:{},
        setup: function(){
            var elements = [];
            
            var collectables = [
                smallElementFactory.getSimpleObjective(location1),
                smallElementFactory.getSimpleObjective(location2),
                smallElementFactory.getSimpleObjective(location3),
                smallElementFactory.getSimpleObjective(location4)
            ];
            var currentCollectable = 0;
            var dropoff = smallElementFactory.getSimpleObjective(dropoffPoint);

            level2.messageQueue = [];

            collectables.forEach(function(collectable){
                collectable.on('complete', function(){
                    collectable.isAlive = false;
                    dropoff.type = 'objective';
                });
            });
            

            dropoff.type = 'ignore';
            dropoff.on('complete', function(){
                dropoff.type = 'ignore';
                currentCollectable++;
                if(collectables[currentCollectable]){
                    level2.messageQueue.push({
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

            var messages = level2.messageQueue.slice();
            level2.messageQueue = [];
            return messages;
        },
        on: function(event, callback){
            events.on(event, callback);
        }
    };

    return level2;
});