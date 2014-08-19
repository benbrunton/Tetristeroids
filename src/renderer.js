function Renderer(ctx){
    this.ctx = ctx;
    this.camera = [];
}

Renderer.prototype.setCamera = function(location) {
    this.camera = location;
};

Renderer.prototype.drawElement = function(element){
    var loc = element.location;
    var i = 0;
    var l = element.blocks.length;
    this.ctx.save();
    this.ctx.translate(-(this.camera[0] - 200), -(this.camera[1] - 200));
    this.ctx.translate(loc[0], loc[1]);
    this.ctx.rotate(element.rotation);

    element.blocks.forEach(this.drawBlock.bind(this));

    this.ctx.restore();
};

Renderer.prototype.drawBlock = function(block){
    this.ctx.save();
    this.ctx.translate(block.location[0] * 10 - 5, block.location[1] * 10 - 5);
    switch(block.type){
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
            this.ctx.fillStyle = 'limegreen';
            this.drawCircle(5, 5, 5);
            this.ctx.fillStyle = 'silver';
            this.ctx.fillRect(0, 5, 10, 5);
            break;
        case 'star':
            this.ctx.fillStyle = 'white';
            this.drawCircle(0, 0, 1);
            break;
        default:
            break;
    }
    this.ctx.restore();
};

Renderer.prototype.paused = function() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.fillText('paused', 150, 195);

    this.ctx.fillRect(0, 0, 10, 10);
};

Renderer.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3){
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.fill();
    this.ctx.closePath();
}

Renderer.prototype.drawCircle = function(x, y, r){
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI*2, false);
    this.ctx.fill();
    this.ctx.closePath();
}