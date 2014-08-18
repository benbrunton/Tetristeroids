function Scenery(){
    this.maxStars = 50;
    this.stars = [];
    this.generateStars();
}

Scenery.prototype.update = function(){
    this.stars.forEach(function(star){
        star.location[1] += 10;
    });
    this.killStars();
    this.generateStars();
};

Scenery.prototype.getElements = function(){
    return this.stars;
};

Scenery.prototype.generateStars = function(){
    while (this.stars.length < this.maxStars){
        var x = Math.round(Math.random() * 400);
        var y = Math.round(Math.random() * 400) - 400;
        this.stars.push({
            location: [x, y],
            blocks:[{type:'star', location:[0, 0]}]
        });
    }
};

Scenery.prototype.killStars = function() {
    this.stars = this.stars.filter(function(star){
        return star.location[1] < 410;
    });
};