define(['blocks', 'context'], function(blocks, render){

    function Renderer(ctx){
        this.ctx = ctx;
        this.camera = [];
        this.messages = [];
    }

    Renderer.prototype.clear = function() {
        this.messages = [];
    };

    Renderer.prototype.setCamera = function(location) {
        this.camera = location;
        document.title = Math.floor(location[0]) + ', ' + Math.floor(location[1]);
    };

    Renderer.prototype.drawElement = function(element){
        var loc = element.location;
        
        this.ctx.save();
        this.ctx.translate(-(this.camera[0] - 200), -(this.camera[1] - 200));
        this.ctx.translate(loc[0], loc[1]);
        this.drawSubElement(element);

        var i = element.subElements ? element.subElements.length : 0;
        var subElement;
        while(i--){
            subElement = element.subElements[i];
            this.ctx.save();
            this.ctx.translate(subElement.location[0] * 10, subElement.location[1] * 10);
            this.drawSubElement(element.subElements[i]);
            this.ctx.restore();
        }

        this.ctx.restore();
    };

    Renderer.prototype.drawSubElement = function(element) {
        this.ctx.rotate(element.rotation);
        var iLen = element.blocks.length;
        var i;
        for(i = 0; i < iLen; i++){
            this.drawBlock(element.blocks[i]);
        }
    };

    Renderer.prototype.drawHud = function(instructions, elements, messages) {
        if(instructions.objectives){
            elements.filter(function(element){
                return element.type === 'objective';
            }).forEach(this.pointAtElement.bind(this));
        }

        elements.forEach(function(element){
            if(element.type === 'player'){
                this._drawPlayerDetails(element, instructions);
            }
        }.bind(this));

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
        var instructions = blocks[block.type];
        var iLen = instructions.length;
        var i, instruction;
        for(i = 0; i < iLen; i++){
            instruction = instructions[i];
            if(instruction.type === 'dynamic'){
                this._executeDynamicInstruction(instruction.value, block);
            }else{
                this._executeInstruction(instruction);
            }
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

    Renderer.prototype._executeInstruction = function(instruction) {
        render(this.ctx, instruction, true);
    };

    Renderer.prototype._executeDynamicInstruction = function(instruction, block) {
        switch(instruction){
            case 'explosion':
                this.ctx.fillStyle = 'white';
                this.drawCircle(5, 5, 2);
                this.ctx.globalAlpha = 0.7;
                this.ctx.fillStyle = this._getExplosionColor(block);
                this.drawCircle(5, 5, this._getExplosionSize(block));
                break;
            case 'counter':
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(0, 0, 19, 19);
                this.ctx.fillStyle = 'black';
                this.ctx.font = '12px Arial';
                var count = block.counter.count.toString();
                if(count.length < 2){
                    count = '0' + count;
                }
                this.ctx.fillText(count, 3, 14);
                break;
            default:
                break;
        }
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

    Renderer.prototype._getExplosionSize = function(block) {
        if(block.age < 5){
            return 3;
        }
        if(block.age < 10){
            return block.size /2;
        }

        if(block.age < 15){
            return block.size;
        }

        if(block.age < 20){
            return block.size * 1.5;
        }

        if(block.age < 25){
            return block.size;
        }

        if(block.age < 30){
            return block.size /2;
        }

        return 1;
    };

    Renderer.prototype._getExplosionColor = function(block) {
        if(block.age < 5){
            return 'white';
        }
        if(block.age < 10){
            return '#d8960f';
        }

        if(block.age < 15){
            return 'white';
        }

        if(block.age < 20){
            return 'yellow';
        }

        return 'white';
    };

    Renderer.prototype._drawPlayerDetails = function(element, instructions) {
        var cash = 0;

        if(element.type === 'player'){
            cash = element.cash;
        }

        if(instructions.cash){
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.fillText('cash : £' + cash, 300, 20);
        }

        if(element.maxShield > 0){
           this.ctx.fillText('shield :' + element.shieldCharge + '/' + element.maxShield, 300, 35); 
        }
    };

    return Renderer;
});