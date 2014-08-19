var level0 = {
    menu : {
        msg: 'level 1 complete',
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
        var x = {
            messageQueue:[],
            isAlive:true,
            blocks:[],
            update: function(){
                var messages = this.messageQueue;
                this.messageQueue = [];
                return messages;
            },
            collision: function(collidedWith){
                if(collidedWith.type === 'player'){
                    this.messageQueue.push({msg:'level-complete'});
                }
            },
            getView: function(){
                return {
                    type: 'objective',
                    location:targetLocation,
                    message: 'get to outpost',
                    blocks: this.blocks
                };
            }
        };


        var i = 4;
        var j;
        while (i--){
            j = 4;
            while(j--){
                x.blocks.push({
                    type:'planet',
                    location:[i - 2, j - 2]
                });
            }
        }

        var elements = [x];

        var maxCoins = 20;
        var distanceFromTarget = 500;
        var i = 0;
        var x, y, value;
        while(i++ < maxCoins){
            if(Math.random() < 0.4){
                continue;
            }

            value = Math.floor(Math.random() * 75);
            x = Math.floor(Math.random() * distanceFromTarget - Math.random() * distanceFromTarget) + targetLocation[0];
            y = Math.floor(Math.random() * distanceFromTarget - Math.random() * distanceFromTarget) + targetLocation[1];

            elements.push(new Coin(value, [x, y]));
        }

        

        return {
            elements: elements,
            playerLocation:[0, 0]
        };
    }
};

function Coin(value, location){
    this.isAlive = true;
    this.location = location;
    this.value = value;
    this.blocks = [{
        type:'coin',
        location:[0, 0]
    }];
}

Coin.prototype.update = function(){
    return [];
};

Coin.prototype.collision = function(collidedWith){
    if(collidedWith.type === 'player'){
        this.isAlive = false;
    }
};


Coin.prototype.getView = function(){
    return {
        type: 'cash',
        location:this.location,
        blocks: this.blocks,
        value: this.value
    };
};