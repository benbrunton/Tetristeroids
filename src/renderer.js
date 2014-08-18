function Renderer(ctx){
    this.ctx = ctx;
}

Renderer.prototype.drawElement = function(element){
    var loc = element.location;
    var i = 0;
    var l = element.blocks.length;
    this.ctx.save();
    this.ctx.translate(loc[0], loc[1]);
    element.blocks.forEach(this.drawBlock.bind(this));
    this.ctx.restore();
};

Renderer.prototype.drawBlock = function(block){
    this.ctx.save();
    this.ctx.translate(block.location[0] * 10, block.location[1] * 10);
    switch(block.type){
        case 'solid':
            this.ctx.fillStyle = 'steelblue';
            this.ctx.fillRect(0, 0, 10, 10);
            break;
        case 'engine':
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(0, 0, 10, 5);
            this.ctx.fillStyle = 'yellow';
            this.drawTriangle(2, 5, 8, 5, 5, 10);
            break;
        case 'standard-gun':
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 8, 10, 2);
            this.ctx.fillStyle = 'green';
            this.drawTriangle(0, 8, 10, 8, 5, 0);
            break;
        case 'missile':
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillRect(4, 2, 2, 4);
            break;
        case 'star':
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 1, 0, Math.PI*2, false);
            this.ctx.fill();
            this.ctx.closePath();
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
}