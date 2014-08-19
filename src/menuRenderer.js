function MenuRenderer(ctx){
    this.ctx = ctx;
}

MenuRenderer.prototype.draw = function(menu) {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '15px Arial';
    this.ctx.fillText(menu.msg, 15, 15);

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
    // body...
};

MenuRenderer.prototype.drawNextMission = function(topPos) {
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(50, topPos, 200, 40);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText('begin next mission', 55, topPos + 20);
};

MenuRenderer.prototype.drawShop = function(topPos) {
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(50, topPos, 200, 40);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText('modify craft', 55, topPos + 20);  
};