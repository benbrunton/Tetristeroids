define(function(){

    var positions = [
        [-1, 0],
        [-1, -1],
        [0, - 1],
        [1, - 1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1]
    ];

    function ConnectedBlocks(){}

    ConnectedBlocks.prototype.check = function(blocks){
        this.blocks = blocks;
        this._generateBlockMap();
        var unconnected = this.blocks.filter(this._unconnected.bind(this));
        var connected = this.blocks.filter(this._connectsToOrigin.bind(this));

        return {connected:connected, unconnected:unconnected};
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
            map['0:0'] = true;
            this._checkNode([0, 0], exists, map);
        }
        
        this.blockMap = map;
    };

    ConnectedBlocks.prototype._checkNode = function(pos, list, map) {


        var i = positions.length;
        while(i--){
            var trans = positions[i]
            var p2 = [pos[0] + trans[0], pos[1] + trans[1]];
            var check = p2[0] + ':' + p2[1];
            if(!map[check] && list[check]){
                map[check] = true;
                this._checkNode(p2, list, map);
            }
        }
    };

    return ConnectedBlocks;
});