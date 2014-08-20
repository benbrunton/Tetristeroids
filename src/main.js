require(['App'], function(App){
    var app = App.getNew();

    document.querySelector('#game_viewport').style.display = 'block';
    document.querySelector('#loader').style.display = 'none';
    app.start();
});