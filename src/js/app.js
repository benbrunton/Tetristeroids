define(
    ['level', 
    'levels/levelList', 
    'game', 
    'renderer', 
    'menuRenderer',
    'scenery',
    'shop'],
    function (Level, 
        levelList,
        Game,
        Renderer,
        MenuRenderer,
        Scenery,
        Shop){


        function newGame(){
            var App = {

                start: function(){
                    
                    App.setup();

                    window.requestAnimationFrame(App.loop);
                    // App.game.player.cash = 20000;
                    // App.drawShop();
                },

                setup : function(){
                    var levels = App.getLevels();
                    App.mode = 'game';
                    App.paused = false;
                    App.ctx = document.querySelector('canvas').getContext('2d');
                    App.game = new Game(levels);
                    App.scenery = new Scenery();
                    App.renderer = new Renderer(App.ctx);
                    App.backupCanvas = document.createElement('canvas');
                    App.backupCanvas.width = App.backupCanvas.height = 400;
                    App.backupCtx = App.backupCanvas.getContext('2d');
                    App.backupRenderer = new Renderer(App.backupCtx);
                    App.menuRenderer = new MenuRenderer(App.ctx);
                    App.shop = new Shop(App.ctx);

                    KeyboardJS.on('p', App.togglePause);
                    KeyboardJS.on('escape', App.togglePause);
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

                    switch(App.mode){
                        case 'game':
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
                            break;
                        case 'level-complete':
                        case 'intro': // fallthrough
                            App.drawMenu();
                            break;
                        case 'game-complete':

                            break;
                    }
                },

                draw : function(){
                    App.backupCtx.fillStyle = '#000000';
                    App.backupCtx.fillRect(0, 0, 400, 400);
                    App.renderer.setCamera(App.game.getCamera());
                    App.backupRenderer.setCamera(App.game.getCamera());
                    var gameElements = App.game.getElements();
                    App.drawList(App.scenery.getElements());
                    App.drawList(gameElements);

                    App.renderer.drawHud(App.game.getHud(), gameElements, App.game.getMessages());
                },

                drawMenu: function(){
                    App.renderer.clear();
                    App.ctx.fillStyle = '#000000';
                    App.ctx.fillRect(0, 0, 400, 400);
                    var menu = App.game.getMenu();
                    App.menuRenderer.draw(menu);
                    App.menuRenderer.wait(function(mode, data){
                        App.menuRenderer.unbind();

                        if(mode === 'next-level'){
                            App.game.start();
                            App.loop();
                            
                        }else if(mode === 'shop'){
                            App.drawShop(data);
                        }else if(mode === 'game'){
                            App.game.beginLevel();
                            App.loop();
                        }
                        
                    });

                },

                drawShop: function(data){
                    App.shop.draw(data, App.game.getPlayer());
                    App.shop.wait(function(player){
                        if(player !== null){
                            App.game.updatePlayer(player);
                        }
                        App.shop.unbind();
                        App.drawMenu();
                    });
                },

                drawList: function(list){
                    list.forEach(App.renderer.drawElement.bind(App.backupRenderer));
                    App.ctx.drawImage(App.backupCanvas, 0, 0);
                },

                handleKeys: function(keys){
                    var game = App.game;

                    //hack
                    var playerEngines = false;
                    var playerShield = false;

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
                                playerEngines = true;
                                break;
                            case 'down':
                                game.movePlayerBackward();
                                break;
                            case 'space':
                                game.playerFires();
                                break;
                            case 'shift':
                                game.playerShield();
                                playerShield = true;
                                break;
                            case 'enter':   //fallthrough
                            case 'z':       //fallthrough
                            case 'x': 
                                game.playerAction(keys[i]);
                                break;
                            default:
                                break;
                        }
                    }


                    // hack #2

                    if(!playerEngines){
                        game.player.cutEngine();
                    }

                    if(!playerShield){
                        game.player.shieldDown();
                    }
                },

                getLevels: function(){
                    return levelList.map(function(level, i){
                        return new Level(i, level);
                    });
                }
            };

            return App;
        }


    return {
        getNew: newGame
    };
});