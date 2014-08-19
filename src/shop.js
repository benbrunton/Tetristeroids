function Shop(ctx, player){
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.player = player;
    this.handleClick = this.clicks.bind(this);
    this.canvas.addEventListener('click', this.handleClick, false);
}

Shop.prototype.draw = function(data) {
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
    this.ctx.restore();
};

Shop.prototype.wait = function(callback) {
    
};

Shop.prototype.unbind = function() {
    this.canvas.removeEventListener('click', this.handleClick, false);
};

Shop.prototype.clicks = function(e){

};