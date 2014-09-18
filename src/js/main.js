require(['App'], function(App){
    var app = App.getNew();

    document.querySelector('#game_viewport').style.display = 'block';
    document.querySelector('#loader').style.display = 'none';

    var idCounter = 0;
    window.getID = function(){
        var uid = Math.floor(Math.random()*10);
        idCounter++;
        return 'c' + uid + idCounter;
    };

    app.start();
});