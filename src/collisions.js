define(function(){

    var MIN_CHECK = 60;

    function Collisions(){

        this.width = 100;
        this.height = 100;
        this.canvas = document.createElement('canvas');
        this.canvas.height = this.width;
        this.canvas.width = this.height;
        this.ctx = this.canvas.getContext('2d');

    }


    Collisions.prototype.check = function(element1, element2){
        
        var comparisonDistance = element1.blocks.length + element2.blocks.length > 10 ? 30 : MIN_CHECK;
        var h = Math.abs(element1.location[0] - element2.location[0]);
        var v = Math.abs(element1.location[1] - element2.location[1]);
        if(h > comparisonDistance){
            return false;
        }

        if(v > comparisonDistance){
            return false;
        }

        if(element1.type === 'ignore' || element2.type === 'ignore'){
            return false;
        }

        var blocks = this._getCollidingBlocks(element1, element2);

        if(blocks.length < 1){
            return false;
        }

        return {
            collided: element2,
            blocks: blocks
        };
    };

    Collisions.prototype._getCollidingBlocks = function(element1, element2){
        var ctx = this.ctx;
        
        ctx.save();
        ctx.translate(-(element2.location[0] - this.width/2), -(element2.location[1] - this.height/2));
        var drawElement2 = this._drawElement(element2);
        ctx.clearRect(0, 0, this.width, this.height);
        var blocks = [];

        element1.blocks.forEach(function(block){

            ctx.save();
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.translate(-(element2.location[0] - this.width/2), -(element2.location[1] - this.height/2));
            ctx.translate(element1.location[0], element1.location[1]);
            ctx.fillStyle = 'white';
            ctx.rotate(element1.rotation);
            ctx.translate(block.location[0] * 10 - 5, block.location[1] * 10 - 5);
            ctx.fillRect(0, 0, 10, 10);
            ctx.restore();
            var blockData = ctx.getImageData(0, 0, this.width, this.height);
            ctx.clearRect(0, 0, this.width, this.height);
            

            if(this._compare(blockData.data, drawElement2.data)){
                blocks.push(block);

                var c = document.querySelectorAll('.output');
                Array.prototype.forEach.call(c, function(n){
                    document.body.removeChild(n);
                });
                
                
                if(false){
                    var c1 = document.createElement('canvas');
                    c1.className = 'output';
                    c1.style.backgroundColor = 'black';
                    c1.width = this.width;
                    c1.height = this.height;
                    var ct1 = c1.getContext('2d');
                    ct1.putImageData(blockData, 0, 0);
                    document.body.appendChild(c1);

                    ctx.save();
                    ctx.translate(-(element2.location[0] - this.width/2), -(element2.location[1] - this.height/2));
                    var el1Data = this._drawElement(element1);
                    var c3 = document.createElement('canvas');
                    c3.className = 'output';
                    c3.style.position = 'absolute';
                    c3.style.left = 0;
                    c3.style.opacity = 0.5;
                    c3.width = this.width;
                    c3.height = this.height;
                    var ct3 = c3.getContext('2d');
                    ct3.putImageData(el1Data, 0, 0);
                    ct3.fillStyle = 'white';
                    ct3.font = '7px Arial';
                    ct3.fillText(element1.type + '[' + element1.blocks.length + ']', 0, 90);
                    document.body.appendChild(c3);

                    var c2 = document.createElement('canvas');
                    c2.className = 'output';
                    c2.style.position = 'absolute';
                    c2.style.left = 0;
                    c2.style.opacity = 0.5;
                    c2.width = this.width;
                    c2.height = this.height;
                    var ct2 = c2.getContext('2d');
                    ct2.fillStyle = 'black';
                    ct2.fillRect(0, 0, 100, 100);
                    ct2.putImageData(drawElement2, 0, 0);
                    ct2.fillStyle = 'white';
                    ct2.font = '7px Arial';
                    ct2.fillText(element2.type + '[' + element2.blocks.length + ']', 50, 90);
                    document.body.appendChild(c2);
                }

                


            }
        }.bind(this));


        this.ctx.restore();
        ctx.clearRect(0, 0, this.width, this.height);
        return blocks;
    };

    Collisions.prototype._drawElement = function(element) {
        var ctx = this.ctx;
        
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.translate(element.location[0], element.location[1]);
        ctx.fillStyle = 'white';
        ctx.rotate(element.rotation);
        element.blocks.forEach(function(block){
            ctx.save();
            ctx.translate(block.location[0] * 10 - 5, block.location[1] * 10 - 5);
            ctx.fillRect(0, 0, 10, 10);
            ctx.restore();
        });

        ctx.restore();

        return ctx.getImageData(0, 0, this.width, this.height);

    };

    Collisions.prototype._compare = function(el1, el2){
        var i = el1.length;
        while(i--){
            if(el1[i] === 0){
                continue;
            }

            if(el1[i] === el2[i]){
                return true;
            }
        }
        return false;
    };

    return Collisions;
});