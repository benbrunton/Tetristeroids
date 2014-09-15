define(function(){
    function ConnectedBlocks(){

    }

    ConnectedBlocks.prototype.check = function(blocks){
        this.blocks = blocks;
        this._generateBlockMap();
        var unconnected = this.blocks.filter(this._unconnected.bind(this));
        var connected = this.blocks.filter(this._connectsToOrigin.bind(this));

        return {connected:this.blocks, unconnected:unconnected};
    }

    ConnectedBlocks.prototype._unconnected = function(block) {
        return !this.blockMap[block.location[0] + ':' + block.location[1]];
    };

    ConnectedBlocks.prototype._connectsToOrigin = function(block) {
        return this.blockMap[block.location[0] + ':' + block.location[1]];
    };

    ConnectedBlocks.prototype._generateBlockMap = function() {
        var exists = {};
        var map = {};
        this.blocks.forEach(function(block){
            exists[block.location[0] + ':' + block.location[1]] = true;
        });

        if(exists['0:0']){
            map['0:0'] = true; // huge assumption
            this._checkNode([0, 0], exists, map);
        }
        
        this.blockMap = map;
    };

    ConnectedBlocks.prototype._checkNode = function(pos, list, map) {
        var positions = [
            [pos[0] - 1, pos[1]],
            [pos[0] - 1, pos[1] -1],
            [pos[0], pos[1] - 1],
            [pos[0] + 1, pos[1] - 1],
            [pos[0] + 1, pos[1]],
            [pos[0] + 1, pos[1] + 1],
            [pos[0], pos[1] + 1],
            [pos[0] - 1, pos[1] +1]
        ];

        var i = positions.length;
        while(i--){
            var p2 = positions[i];
            var check = p2[0] + ':' + p2[1];
            if(!map[check] && list[check]){
                map[check] = true;
                this._checkNode(p2, list, map);
            }
        }
    };

    return ConnectedBlocks;
});