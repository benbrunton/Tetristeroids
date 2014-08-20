define(function(){

    function Shop(ctx){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.handleClick = this.clicks.bind(this);
        this.player = null;
        this.callback = function(){};
        this.buttons = [];
        this.updates = {};

        this.items = [
            {name: 'shield', level:0, price: 200},
            {name: 'generator', level:0, price: 200},
            {name: 'standard-gun', level:0, price: 500},
            {name: 'solid', level:0, price: 150},
            {name: 'engine', level:0, price: 450},
            {name: 'cockpit', level:0, price: 300},
            {name: 'none', level:0, price:0}
        ];
    }

    Shop.prototype.draw = function(data, player) {
        this.unbind();
        this.canvas.addEventListener('click', this.handleClick, false);
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
            this.drawElement(x, y, block.type);
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
            type: selectedItem
        })
    };

    Shop.prototype.wait = function(callback) {
        this.callback = callback;
    };

    Shop.prototype.unbind = function() {
        this.canvas.removeEventListener('click', this.handleClick, false);
    };

    Shop.prototype.clicks = function(e){
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

    Shop.prototype.drawButtons = function(data){
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(300, 350, 80, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('done', 320, 372);

        var xPos = 50;
        
        this.items.forEach(function(item){
            this.ctx.save();
            this.ctx.translate(xPos, 300);
            this.ctx.scale(2, 2);
            this.drawElement(0, 0, item.name);
            this.buttons.push({
                x: xPos, y: 300, w: 20, h: 20, execute:function(){
                    this.selectedItem = item.name;
                }.bind(this)
            });
            xPos += 22;
            this.ctx.restore();
        }.bind(this));

        
    };

    Shop.prototype.drawElement = function(x, y, type){
        switch(type){
            case 'solid':
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 0, 10, 10);
                this.ctx.fillStyle = 'steelblue';
                this.ctx.fillRect(2, 0, 6, 10);
                break;
            case 'cockpit':
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 0, 10, 10);
                this.ctx.fillStyle = 'blue';
                this.ctx.fillRect(1, 1, 8, 6);
                break;
            case 'generator':
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 0, 10, 10);
                this.ctx.fillStyle = 'gold';
                this.drawCircle(5, 5, 3);
                break;
            case 'engine':
                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(0, 0, 10, 5);
                this.ctx.fillStyle = 'yellow';
                this.drawTriangle(2, 5, 8, 5, 5, 10);
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 0, 10, 4);
                break;
            case 'standard-gun':
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(1, 7, 8, 3);
                this.ctx.fillStyle = 'darkgrey';
                this.ctx.fillRect(3, 4, 4, 3);
                this.ctx.fillStyle = 'green';
                this.drawTriangle(2, 4, 8, 4, 5, 0);
                break;
            case 'missile':
                this.ctx.fillStyle = 'yellow';
                this.ctx.fillRect(4, 2, 2, 4);
                break;
            case 'shield':
                this.ctx.fillStyle = 'gold';
                this.ctx.globalAlpha=0.4;
                this.drawCircle(5, 5, 5);
                this.ctx.globalAlpha=1.0;
                this.ctx.fillStyle = 'limegreen';
                this.drawCircle(5, 5, 2);
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 5, 10, 5);
                break;
            case 'none':
                this.ctx.fillStyle = '#CCC';
                this.ctx.fillRect(0, 0, 10, 10);
                this.ctx.fillStyle = 'red';
                this.ctx.font = '10px Arial'
                this.ctx.fillText('x', 3, 8);
                break;
        }
    };

    Shop.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.fill();
        this.ctx.closePath();
    };

    Shop.prototype.drawCircle = function(x, y, r){
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI*2, false);
        this.ctx.fill();
        this.ctx.closePath();
    };

    return Shop;
});