function Level(instructions){
    this.instructions = instructions;
}

Level.prototype.setup = function(){
    return this.instructions.setup();
};


var level0 = {
    setup: function(){
        console.log('level 0 setup');
        var x = {
            messageQueue:[],
            isAlive:true,
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
                    location:[2000, 3000],
                    message: 'get to outpost',
                    blocks: [
                        {
                            type: 'planet',
                            location:[0,0]
                        },
                        {
                            type: 'planet',
                            location:[1,0]
                        },
                        {
                            type: 'planet',
                            location:[2,0]
                        },
                        {
                            type: 'planet',
                            location:[1,1]
                        },
                        {
                            type: 'planet',
                            location:[0,1]
                        },
                        {
                            type: 'planet',
                            location:[2,1]
                        },
                        {
                            type: 'planet',
                            location:[1,-1]
                        },
                        {
                            type: 'planet',
                            location:[0,-1]
                        },
                        {
                            type: 'planet',
                            location:[2,-1]
                        }
                    ]
                };
            }
        }

        return {
            elements:[x],
            playerLocation:[0, 0]
        };
    }
};