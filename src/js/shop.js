define(['blocks', 'context'], function(blocks, context){

    function Shop(ctx){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.handleClick = this.clicks.bind(this);
        this.handleRollover = this.rollovers.bind(this);
        this.player = null;
        this.callback = function(){};
        this.buttons = [];
        this.updates = {};

        this.items = [
            {name: 'bumper', level:0, price: 200, instruction:'bumper'},
            //{name: 'generator', level:0, price: 200, instruction: 'generator'},
            {name: 'standard-gun', level:0, price: 500, instruction: 'gun'},
            {name: 'solid', level:0, price: 150, instruction: 'fuselage'},
            {name: 'engine', level:0, price: 450, instruction: 'engine'},
            {name: 'cockpit', level:0, price: 300, instruction: 'cockpit'},
            {name: 'shield', level:0, price: 200, instruction: 'shield'},
            {name: 'aero', level:0, price:150, instruction:'wing'},
            {name: 'electro-magnet', level:0, price:100, instruction:'electro magnet'},



            {name: 'none', level:0, price:0, instruction: 'destroy'}
        ];

        this.damage = {
            'bumper' : 100,
            'generator' : 4,
            'standard-gun' : 2,
            'solid': 4,
            'engine': 10,
            'cockpit' :10,
            'shield': 2
        };
    }

    Shop.prototype.draw = function(data, player) {
        this.unbind();
        this.canvas.addEventListener('click', this.handleClick, false);
        this.canvas.addEventListener('mousemove', this.handleRollover, false);
        this.buttons = [];
        this.player = player;
        this.data = data;
        this.blocks = player.blocks.slice(0);
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, 400, 400);

        this.drawGrid();

        this.drawButtons(data);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('cash : £' + this.player.cash, 320, 20);
        this.ctx.fillText('cost : £' + this.calculateCost(), 320, 40);
    };

    Shop.prototype.calculateCost = function() {
        var cost = 0;
        for(var i in this.updates){
            cost += this.updates[i];
        }
        return cost;
    };

    Shop.prototype.drawGrid = function() {
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(50, 20, 190, 190);

        this.ctx.save();
        this.ctx.fillStyle = '#222222';
        this.ctx.translate(51, 21);

        var i = 9;
        var j, x, y;
        while(i--){
            j = 9;
            while(j--){
                x = i * 21;
                y = j * 21;
                (function(i, j, x, y){
                    this.buttons.push({
                        x: x + 51,
                        y: y + 21,
                        w: 20,
                        h: 20,
                        execute: function(){
                            this.update(i - 4, j - 4);
                        }.bind(this)
                    });
                }.bind(this)(i, j, x, y));
                
                this.ctx.fillRect(x, y, 20, 20);
            }
        }
        

        this.blocks.forEach(function(block){
            var x = (4 * 21) + (block.location[0] * 21);
            var y = (4 * 21) + (block.location[1] * 21);
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.scale(2, 2);
            this.drawElement(block.type);
            this.ctx.restore();
        }.bind(this));

        this.ctx.restore();
    };

    Shop.prototype.update = function(x, y){
        if(this.selectedItem === 'none'){
            this.removeBlock(x, y);
            delete this.updates[x + ':' + y];
            
        }else if (this.selectedItem){
            this.replaceBlock(x, y, this.selectedItem);
            var cost = 0;
            this.items.forEach(function(item){
                if(item.name === this.selectedItem){
                    cost = item.price;
                }
            }.bind(this));
            this.updates[x + ':' + y] = cost;
        }
        
        this.player.blocks = this.blocks;
        this.draw(this.data, this.player);
    };

    Shop.prototype.removeBlock = function(x, y){
        this.blocks = this.blocks.filter(function(block){
            return block.location[0] !== x || block.location[1] !== y;
        });
    };

    Shop.prototype.replaceBlock = function(x, y, selectedItem) {
        this.removeBlock(x, y);
        this.blocks.push({
            location:[x, y],
            type: selectedItem,
            damage: this.damage[selectedItem] || 1
        })
    };

    Shop.prototype.wait = function(callback) {
        this.callback = callback;
    };

    Shop.prototype.unbind = function() {
        this.canvas.removeEventListener('click', this.handleClick, false);
        this.canvas.removeEventListener('mousemove', this.handleRollover, false);
    };

    Shop.prototype.clicks = function(e){

        //done button hack
        if(e.layerX > 300 && e.layerX < 380 && e.layerY > 350 && e.layerY < 380){

            
            this.player.blocks = this.blocks;
            this.player.cash -= this.calculateCost();

            if(this.player.cash < 0){
                this.player = null;
            }

            this.callback(this.player);
            this.callback = function(){};
            this.updates = {};
            return;
        }

        this.buttons.forEach(function(button){
            if(!(e.layerX > button.x && e.layerX < button.x + button.w)){
                return;
            }

            if(!(e.layerY > button.y && e.layerY < button.y + button.h)){
                return;
            }

            button.execute();
        });
    };

    Shop.prototype.rollovers = function(e){
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 350, 200, 100);

        this.buttons.forEach(function(button){
            if(!(e.layerX > button.x && e.layerX < button.x + button.w)){
                return;
            }

            if(!(e.layerY > button.y && e.layerY < button.y + button.h)){
                return;
            }


            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 350, 200, 100);
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = 'white';
            try{
                this.ctx.fillText(button.rollover(), 50, 365);
            }catch(e){}
        }.bind(this));


        this.ctx.restore();
    };

    Shop.prototype.drawButtons = function(data){
        this.ctx.fillStyle = '#0f284c';
        this.ctx.fillRect(300, 350, 80, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('done', 320, 372);

        var xPos = 50;
        var yPos = 220;
        
        this.items.forEach(function(item){
            this.ctx.save();
            this.ctx.translate(xPos, yPos);
            this.ctx.scale(2, 2);
            this.drawElement(item.name);
            this.buttons.push({
                x: xPos, y: yPos, w: 20, h: 20, execute:function(){
                    this.selectedItem = item.name;
                }.bind(this),
                rollover:function(){
                    return item.instruction + ' : £' + item.price;
                }
            });
            xPos += 22;
            this.ctx.restore();
        }.bind(this));

        
    };

    Shop.prototype.drawElement = function(type){
        var instructions = blocks[type];
        var ctx = this.ctx;
        instructions.forEach(function(instruction){
            context(ctx, instruction, true);
        });
        
    };

    return Shop;
});