function Player(){
    
    this.messageQueue = [];

    this.lastFired = 0;

    this.type = 'ship';
    this.location = [170, 340];
    this.blocks = [
        {
            location: [0, 0], 
            type: 'solid'
        },
        {
            location: [0, 1], 
            type: 'engine'
        },
        {
            location: [0, -1], 
            type: 'standard-gun'
        }
    ];

    return this;
    

    this.blocks = [
        {
            location: [0, 0], 
            type: 'solid'
        },
        {
            location: [1, 0], 
            type: 'solid'
        },
        {
            location: [-1, 0], 
            type: 'solid'
        },
        {
            location: [0, 1], 
            type: 'engine'
        },
        {
            location: [-1, 1], 
            type: 'engine'
        },
        {
            location: [1, 1], 
            type: 'engine'
        },
        {
            location: [-1, -1], 
            type: 'standard-gun'
        },
        {
            location: [0, -1], 
            type: 'standard-gun'
        },
        {
            location: [1, -1], 
            type: 'standard-gun'
        }
    ];
}

Player.prototype.update = function(){
    var messages = [];
    messages = messages.concat(this.messageQueue);
    this.messageQueue = [];
    return messages;
};

Player.prototype.getView = function() {
    return {
        location: this.location,
        blocks: this.blocks,
        type: this.type
    };
};

Player.prototype.power = function() {
    return this.blocks.filter(function(block){
        return block.type === 'engine';
    }).length / 2;
};

Player.prototype.forward = function() {
    this.location[1] -= this.power();
};

Player.prototype.backward = function() {
    this.location[1] += this.power();
};

Player.prototype.left = function() {
    this.location[0] -= this.power();
};

Player.prototype.right = function() {
    this.location[0] += this.power();
};

Player.prototype.fire = function(){
    if(Date.now() - 100 < this.lastFired){
        return;
    }
    this.blocks.filter(function(block){
            return block.type === 'standard-gun';
        })
        .forEach(function(block){
            this.messageQueue.push({msg:'standard-player-fire', pos:this.mergeLocation(block.location)});
        }.bind(this));

    this.lastFired = Date.now();
};

Player.prototype.mergeLocation = function(loc){
    return [this.location[0] + loc[0] * 10, this.location[1] + loc[1] * 10];
}


function PlayerMissile(pos){
    this.type = 'missile';
    this.blocks = [{
        location: [0, 0],
        type: 'missile'
    }];
    this.location = [pos[0], pos[1] - 10];

}

PlayerMissile.prototype.update = function(){
    this.location[1] -= 10;
    return [];
}

PlayerMissile.prototype.getView = function() {
    return {
        location: this.location,
        type: this.type,
        blocks: this.blocks
    }
};