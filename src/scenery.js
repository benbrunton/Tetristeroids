function Scenery(){
    this.maxStars = 250;
    this.maxDistance = 2000 * 2000;
    this.minDistance = 300 * 300;
    this.stars = [];
    this.generateStars([0, 0]);
}

Scenery.prototype.update = function(camera){
    this.killStars(camera);
    this.generateStars(camera);
};

Scenery.prototype.getElements = function(){
    return this.stars;
};

Scenery.prototype.generateStars = function(camera){
    while (this.stars.length < this.maxStars){
        var x = camera[0] + Math.round(Math.random() * 1000) * (Math.random() > 0.5 ? -1 : 1);
        var y = camera[1] + Math.round(Math.random() * 1000) * (Math.random() > 0.5 ? -1 : 1);

        var dx = x - camera[0];
        var dy = y - camera[1];

        var distance = dx * dx + dy * dy;
        if(distance < this.minDistance){
            continue;
        }

        this.stars.push({
            location: [x, y],
            blocks:[{type:'star', location:[0, 0]}]
        });
    }
};

Scenery.prototype.killStars = function(camera) {
    this.stars = this.stars.filter(function(star){
        var dx = star.location[0] - camera[0];
        var dy = star.location[1] - camera[1];
        var distance = dx * dx + dy * dy;
        return distance < this.maxDistance;
    }.bind(this));
};