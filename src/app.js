
function newGame(){
    var App = {

        start: function(){
            
            App.setup();

            window.requestAnimationFrame(App.loop);
        },

        setup : function(){
            App.paused = false;
            App.ctx = document.querySelector('canvas').getContext('2d');
            App.game = new Game();
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
            var keys = KeyboardJS.activeKeys();

            App.handleKeys(keys);

            App.draw();
            if(!App.paused){
                App.game.update();
                window.requestAnimationFrame(App.loop);
            }else{
                App.renderer.paused();
            }
        },

        draw : function(){
            App.ctx.fillStyle = '#000000';
            App.ctx.fillRect(0, 0, 400, 400);

            var elements = App.game.getElements();
            var l = elements.length;
            var i = 0;
            while(i < l){
                App.renderer.drawElement(elements[i]);
                i++;
            }
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

        log : function (msg){
            console.log(msg);
            var p = document.createElement('p');
            p.innerText = msg;
            document.querySelector("#output").appendChild(p);
        }
    };

    return App;
}