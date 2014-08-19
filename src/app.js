
function newGame(){
    var App = {

        start: function(){
            
            App.setup();

            window.requestAnimationFrame(App.loop);
        },

        setup : function(){
            var levels = App.getLevels();
            App.mode = 'game';
            App.paused = false;
            App.ctx = document.querySelector('canvas').getContext('2d');
            App.game = new Game(levels);
            App.scenery = new Scenery();
            App.renderer = new Renderer(App.ctx);

            KeyboardJS.on('p', App.togglePause);
            KeyboardJS.on('space', function(e){e.preventDefault();});
            KeyboardJS.on('up', function(e){e.preventDefault();});
            KeyboardJS.on('down', function(e){e.preventDefault();});
        },

        togglePause : function(){
            App.paused = !App.paused;
            if (!App.paused) {
                window.requestAnimationFrame(App.loop);
            }
        },

        loop : function(){
            
            App.mode = App.game.getMode();

            if(App.mode === 'game'){
                var keys = KeyboardJS.activeKeys();
                App.handleKeys(keys);
                App.draw();
                if(!App.paused){
                    var camera = App.game.getCamera();
                    App.game.update();
                    App.scenery.update(camera);
                    window.requestAnimationFrame(App.loop);
                }else{
                    App.renderer.paused();
                }
            }else{
                App.drawMenu();
            }
        },

        draw : function(){
            App.ctx.fillStyle = '#000000';
            App.ctx.fillRect(0, 0, 400, 400);
            App.renderer.setCamera(App.game.getCamera());
            var gameElements = App.game.getElements();
            App.drawList(App.scenery.getElements());
            App.drawList(gameElements);

            App.renderer.drawHud(gameElements);
        },

        drawMenu: function(){
            App.ctx.fillStyle = '#000000';
            App.ctx.fillRect(0, 0, 400, 400);
            KeyboardJS.clear('space');
            KeyboardJS.on('space', function(e){
                App.game.start();
                KeyboardJS.clear('space');
                KeyboardJS.on('space', function(e){
                    e.preventDefault();
                });
                App.loop();
            });
            App.ctx.fillStyle = 'white';
            App.ctx.font = '20px Arial';
            App.ctx.fillText('press Space to continue', 90, 195);

        },

        drawList: function(list){
            list.forEach(App.renderer.drawElement.bind(App.renderer));
        },

        handleKeys: function(keys){
            var game = App.game;

            var i = keys.length;
            while(i--){
                switch(keys[i]){
                    case 'left':
                        game.movePlayerLeft();
                        break;
                    case 'right':
                        game.movePlayerRight();
                        break;
                    case 'up':
                        game.movePlayerForward();
                        break;
                    case 'down':
                        game.movePlayerBackward();
                        break;
                    case 'space':
                        game.playerFires();
                        break;
                    default:
                        break;
                }
            }
        },

        getLevels: function(){
            var levels = [];

            levels.push(new Level(level0));
            levels.push(new Level(level0));
            return levels;
        }
    };

    return App;
}   