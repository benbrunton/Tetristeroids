define(function(){

    function Renderer(ctx){
        this.ctx = ctx;
        this.camera = [];
        this.messages = [];
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

    Renderer.prototype.drawHud = function(instructions, elements, messages) {
        var cash = 0;

        if(instructions.objectives){
            elements.filter(function(element){
                return element.type === 'objective';
            }).forEach(this.pointAtElement.bind(this));
        }

        elements.forEach(function(element){
            if(element.type === 'player'){
                cash = element.cash;
            }
        });

        if(instructions.cash){
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.fillText('cash : £' + cash, 320, 20);
        }

        messages.forEach(function(message){
            this.messages.push({time: 0, message: message});
        }.bind(this));

        this.messages = this.messages.filter(function(m){
            return m.time < 300;
        });

        this.messages.forEach(function(m){
            this.ctx.save();
            if(m.time < 100){
                this.ctx.globalAlpha = m.time / 100;
            }

            if(m.time > 200){
                this.ctx.globalAlpha = (300 - m.time) / 100;
            }

            this.ctx.fillStyle = m.message.color;
            this.ctx.font = (m.message.font + 'px Arial');
            this.ctx.fillText(m.message.message, m.message.position[0], m.message.position[1]);
            this.ctx.restore();
            m.time++;
        }.bind(this));

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
            case 'aero':
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 0, 2, 10);
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(8, 0, 2, 10);
                this.ctx.fillStyle = 'steelblue';
                this.ctx.fillRect(0, 2, 10, 6);
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
            case 'coin':
                this.ctx.fillStyle = 'gold';
                this.drawCircle(0, 0, 5);
                this.ctx.fillStyle = 'yellow';
                this.drawCircle(0, 0, 2);
                break;
            case 'planet':
                this.ctx.fillStyle = 'pink';
                this.ctx.fillRect(0, 0, 10, 10);
                break;
            case 'rebel-motif':
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 0, 10, 10);
                this.ctx.fillStyle = 'red';
                this.drawCircle(3, 3, 2);
                this.ctx.fillStyle = 'black';
                this.ctx.fillRect(2, 0, 2, 10);
                break;
            case 'fed-motif':
                this.ctx.fillStyle = 'silver';
                this.ctx.fillRect(0, 0, 10, 10);
                this.ctx.fillStyle = 'black';
                this.drawCircle(5, 5, 4);
                this.ctx.fillStyle = 'silver';
                this.drawCircle(5, 5, 3);
                break;
            default:
                break;
        }
        this.ctx.restore();
    };

    Renderer.prototype.pointAtElement = function(element){
        var dx = this.camera[0] - element.location[0];
        var dy = this.camera[1] - element.location[1];
        var r = Math.atan2(dy, dx) - Math.PI/2;

        var playerDistance = (dx * dx + dy * dy);

        dx = Math.sin(r);
        dy = Math.cos(r);

        var distance = 170;

        while(distance * distance > playerDistance - 300 && distance > 50){
            distance -= 20;
        }

        var x = dx * (distance);
        var y = dy * (distance);

        this.ctx.save();

        this.ctx.translate(200, 200);
        this.ctx.translate(x, -y);
        this.ctx.rotate(r);
        
        this.ctx.globalAlpha = 0.7;
        
        this.ctx.fillStyle = 'yellow';
        this.drawTriangle(-15, 20, 0, 15, 0, 0);
        this.drawTriangle(15, 20, 0, 15, 0, 0);
        this.ctx.restore();
    };

    Renderer.prototype.paused = function() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('paused', 150, 155);

        this.ctx.fillRect(0, 0, 10, 10);
    };

    Renderer.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.fill();
        this.ctx.closePath();
    };

    Renderer.prototype.drawCircle = function(x, y, r){
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI*2, false);
        this.ctx.fill();
        this.ctx.closePath();
    };

    return Renderer;
});