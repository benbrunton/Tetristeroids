define(function(){

    function MenuRenderer(ctx){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.buttons = [];
        this.canvas.addEventListener('click', this.checkButtons.bind(this), false);
    }

    MenuRenderer.prototype.draw = function(menu) {
        this.buttons = [];
        this.ctx.fillStyle = 'white';
        this.ctx.font = '15px Arial';
        this.ctx.fillText(menu.msg, 15, 15);
        this.action = function(){};

        var topPos = 50;
        menu.options.forEach(function(option){
            switch(option.type){
                case 'shop':
                    this.drawShop(topPos);
                    break;
                case 'next mission':
                    this.drawNextMission(topPos);
                    break;
            }
            topPos += 100;
        }.bind(this));
    };

    MenuRenderer.prototype.unbind = function() {
        this.buttons = [];
        this.action = function(){};
    };

    MenuRenderer.prototype.checkButtons = function(e){
        this.buttons.forEach(function(button){
            if(!(e.layerX > button.x && e.layerX < button.x + button.w)){
                return;
            }

            if(!(e.layerY > button.y && e.layerY < button.y + button.h)){
                return;
            }

            this.action(button.action);
        }.bind(this));
    };

    MenuRenderer.prototype.wait = function(callback){
        this.action = callback;
    };

    MenuRenderer.prototype.drawNextMission = function(topPos) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(80, topPos, 200, 40);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('begin next mission', 85, topPos + 20);
        this.buttons.push({x: 80, y: topPos, w: 200, h: 40, action:'game'});
    };

    MenuRenderer.prototype.drawShop = function(topPos) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(80, topPos, 200, 40);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('modify craft', 85, topPos + 20);
        this.buttons.push({x: 80, y: topPos, w: 200, h: 40, action:'shop'});
    };

    return MenuRenderer;
});