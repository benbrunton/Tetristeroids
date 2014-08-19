function Shop(ctx){
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.handleClick = this.clicks.bind(this);
    this.player = null;
    this.callback = function(){};
}

Shop.prototype.draw = function(data, player) {
    this.unbind();
    this.canvas.addEventListener('click', this.handleClick, false);
    this.player = player;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, 400, 400);

    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(50, 20, 211, 211);

    this.ctx.save();
    this.ctx.fillStyle = '#222222';
    this.ctx.translate(51, 21);

    var i = 10;
    while(i--){
        var j = 10;
        while(j--){
            this.ctx.fillRect(i * 21, j * 21, 20, 20);
        }
    }
    

    player.blocks.forEach(function(block){
        var x = (5 * 21) + (block.location[0] * 21);
        var y = (5 * 21) + (block.location[1] * 21);
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(2, 2);
        this.drawElement(x, y, block.type);
        this.ctx.restore();
    }.bind(this));

    this.ctx.restore();

    this.drawButtons();
};

Shop.prototype.wait = function(callback) {
    this.callback = callback;
};

Shop.prototype.unbind = function() {
    this.canvas.removeEventListener('click', this.handleClick, false);
};

Shop.prototype.clicks = function(e){
    if(e.layerX > 300 && e.layerX < 380 && e.layerY > 350 && e.layerY < 380){
        this.callback(this.player);
        this.callback = function(){};
    }
};

Shop.prototype.drawButtons = function(){
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(300, 350, 80, 30);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText('back', 320, 372);
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
        case 'star':
            this.ctx.fillStyle = 'white';
            this.drawCircle(0, 0, 1);
            break;
        case 'planet':
            this.ctx.fillStyle = 'pink';
            this.ctx.fillRect(0, 0, 10, 10);
        default:
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
}

Shop.prototype.drawCircle = function(x, y, r){
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI*2, false);
    this.ctx.fill();
    this.ctx.closePath();
}