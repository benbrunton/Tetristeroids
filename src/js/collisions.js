define(['blocks', 'context'], function(blocks, context){

    var MIN_CHECK = 150;

    function Collisions(){

        this.width = 100;
        this.height = 100;
        this.canvas = document.createElement('canvas');
        this.canvas.height = this.width;
        this.canvas.width = this.height;
        this.ctx = this.canvas.getContext('2d');

    }


    Collisions.prototype.check = function(element1, element2){
        
        var h = Math.abs(element1.location[0] - element2.location[0]);
        var v = Math.abs(element1.location[1] - element2.location[1]);
        if(h > MIN_CHECK){
            return false;
        }

        if(v > MIN_CHECK){
            return false;
        }

        

        var max1 = this._getLongestRadius(element1);
        var max2 = this._getLongestRadius(element2);

        if(h > max1 + max2){
            return false;
        }

        if(v > max1 + max2){
            return false;
        }


        var blocks = element2.noDamage ? [] : this._getCollidingBlocks(element1, element2);
        var el2blocks = element1.noDamage ? [] : this._getCollidingBlocks(element2, element1);

        if(blocks.length < 1 && el2blocks.length <1){
            return false;
        }

        var type = blocks.some(function(block){
            return block.type === 'shield';
        }) ? 'hard':'soft';

        var type2 = el2blocks.some(function(block){
            return block.type === 'shield';
        }) ? 'hard' : 'soft';

        return {
            element1: {
                collided: element2,
                blocks: blocks,
                type:type2
            }, 
            element2: {
                collided:element1,
                blocks:el2blocks,
                type:type
            }
        };
    };

    Collisions.prototype._getCollidingBlocks = function(element1, element2){
        var ctx = this.ctx;
        this._setWidths(element2);
        
        ctx.save();
        ctx.translate(-(element2.location[0] - this.width/2), -(element2.location[1] - this.height/2));
        var drawElement2 = this._drawElement(element2);
        ctx.clearRect(0, 0, this.width, this.height);
        var blocks = [];

        var i = element1.blocks.length;
        while(i--){
            var block = element1.blocks[i];

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
            }
        }

        this.ctx.restore();
        ctx.clearRect(0, 0, this.width, this.height);
        return blocks;
    };

    Collisions.prototype._drawElement = function(element) {
        var ctx = this.ctx;
        var instructions, j;
        
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.translate(element.location[0], element.location[1]);
        ctx.fillStyle = 'white';
        ctx.rotate(element.rotation);
        var i = element.blocks.length;
        var block;
        while(i--){
            block = element.blocks[i];
            ctx.save();
            ctx.translate(block.location[0] * 10 - 5, block.location[1] * 10 - 5);
            // ctx.fillRect(0, 0, 10, 10);
            instructions = blocks[block.type];
            j = instructions.length;
            while(j--){
                context(ctx, instructions[j], false);
            }
            ctx.restore();
        }

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

    Collisions.prototype._getLongestRadius = function(element) {
        if(element._longestRadius){
            
            return element._longestRadius;
        }
        
        var longestRadius = Math.max.apply(null, element.blocks.map(function(block){
            return Math.max(block.location[0], block.location[1]);
        })) * 9 + 10;
        
        element._longestRadius = longestRadius;
        return element._longestRadius;
    };

    Collisions.prototype._setWidths = function(element){
        var minLeft = 0;
        var maxRight = 0;
        var minBottom = 0;
        var maxTop = 0;

        element.blocks.forEach(function(block) {
          if (block.location[0] > maxRight) {
            maxRight = block.location[0];
          }
          if (block.location[0] < maxRight) {
            minLeft = block.location[0];
          }
          if (block.location[1] > maxTop) {
            maxTop = block.location[1];
          }
          if (block.location[1] > minBottom) {
            minBottom = block.location[1];
          }
        });
        
        this.width =  (1 + maxRight - minLeft) * 10;
        this.height = (1 + maxTop - minBottom) * 10;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
    };

    return Collisions;
});