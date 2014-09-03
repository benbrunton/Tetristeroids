// do a mission for the resistance
// collect and deliver
// add some bad guy ships

define(['events', 'smallElementFactory'], function(Events, smallElementFactory){
    var events = new Events();
    var startLocation = [0, 0];

    var location1 = [2000, 1350];
    var location2 = [0, 0];

    var level2 = {
        hud:{
            cash: true,
            objectives: true
        },
        messageQueue: [],
        messages:{},
        setup: function(){
            var elements = [];
            var firstCollectable = smallElementFactory.getSimpleObjective(location1);
            var dropoff = smallElementFactory.getSimpleObjective(location2);

            level2.messageQueue = [];

            firstCollectable.on('complete', function(){
                firstCollectable.isAlive = false;
                dropoff.type = 'objective';
            });

            dropoff.type = 'ignore';
            dropoff.on('complete', function(){
                dropoff.type = 'ignore';
            });

            elements.push(firstCollectable);
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