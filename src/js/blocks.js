define(function(){

    var SHIP_STANDARD = 'silver';
    var SHIP_FOREGROUND = 'steelblue';
    var OBJECTIVE = 'silver';
    var ASTEROID = '#9e6546';
    var REBEL1 = 'red';
    var REBEL2 = 'black';
    var FED1 = 'black';

    return {
        'solid':[
            {color:SHIP_STANDARD, type:'block'},
            {color:SHIP_FOREGROUND, type:'rect', pos:[2, 0], width:6, height:10}
        ],
        'tetris':[
            {type:'alpha', value:0.4},
            {type:'block', color:'red'}
        ],
        'tetris-board':[
            {type:'alpha', value:0.5},
            {type:'block', color:'#ccc'}
        ],
        'aero':[
            {color:SHIP_STANDARD, type:'rect', pos:[0,0], width:2, height:10},
            {color:SHIP_STANDARD, type:'rect', pos:[8,0], width:2, height:10},
            {color:SHIP_FOREGROUND, type:'rect', pos:[0,2], width:10, height:6}
        ],
        'cockpit':[
            {color:SHIP_STANDARD, type:'rect', pos:[0,0], width:10, height:10},
            {color:'#181b54', type:'rect', pos:[1,1], width:8, height:6},
            {type:'alpha', value:0.25},
            {color:'white', type:'triangle', pos:[[0, 0], [4, 3], [1, 5]]},
            {color:'white', type:'triangle', pos:[[9, 2], [6, 3], [9, 5]]}
        ],
        'generator':[
            {color:SHIP_STANDARD, type:'rect', pos:[0, 0], width:10, height:10},
            {color:'gold', type:'circle', pos:[5, 5], radius:3}
        ],
        'engine':[
            {color:'#8e0e11', type:'rect', pos:[0, 0], width:10, height:5},
            {color:SHIP_STANDARD, type:'rect', pos:[0, 0], width:10, height:4},
            {type:'alpha', value:0.5},
            {color:'yellow', type:'triangle', pos:[[2, 5], [8, 5], [5, 10]]},
            {type:'alpha', value:1.0},
            {color:'white', type:'triangle', pos:[[3, 5], [7, 5], [5, 7]]}
        ],
        'standard-gun':[
            {color:SHIP_STANDARD, type:'rect', pos:[1, 7], width:8, height:3},
            {color:'#e3e6f6', type:'circle', pos:[5, 2], radius:2},
            {color:'#e3e6f6', type:'rect', pos:[3, 2], width:4, height:6},
            {color:'#444', type:'rect', pos:[1, 7], width:8, height:1},
            {color:'#444', type:'rect', pos:[4, 0], width:2, height:6}
        ],
        'missile':[
            {type:'alpha', value:0.5},
            {color:'yellow', type:'rect', pos:[4, 2], width:2, height:4},
            {type:'alpha', value:0.2},
            {color:'gold', type:'rect', pos:[4, 1], width:2, height:4}
        ],
        'bumper':[
            {type:'alpha', value:0.4},
            {color:'#ffff98', type:'circle', pos:[5,5], radius:5},
            {type:'alpha', value:1.0},
            {color:'#ffff98', type:'circle', pos:[5,5], radius:2},
            {color:SHIP_STANDARD, type:'rect', pos:[0, 5], width:10, height:5},
            {color:'#1c4226', type:'rect', pos:[0, 5], width:10, height:2}
        ],
        'star':[
            {type:'circle', color:'white', pos:[5, 5], radius:1}
        ],
        'coin':[
            {type:'circle', color:'gold', pos:[5, 5], radius:5},
            {type:'circle', color:'yellow', pos:[5, 5], radius:2}
        ],
        'planet':[
            {type:'rect', color:'pink', pos:[0, 0], width:10, height:10}
        ],
        'objective':[
            {type:'rect', color:OBJECTIVE, pos:[0, 0], width:10, height:10}
        ],
        'collectable':[
            {type:'alpha', value:0.4},
            {type:'rect', color:'yellow', pos:[0, 0], width:10, height:10}
        ],
        'rebel-motif':[
            {type:'block', color:SHIP_STANDARD},
            {type:'circle', color:REBEL1, pos:[3, 3], radius:2},
            {type:'rect', color:REBEL2, pos:[2, 0], width:2, height:10}
        ],
        'fed-motif':[
            {type:'block', color:SHIP_STANDARD},
            {type:'circle', color:FED1, pos:[5, 5], radius:4},
            {type:'circle', color:SHIP_STANDARD, pos:[5, 5], radius:3},
        ],
        'asteroid':[
            {type:'block', color:ASTEROID}
        ],
        'structure':[
            {type:'block', color:'#516c71'},
            {type:'rect', color:'#0c3816', pos:[0, 0], height:3, width:3},
            {type:'alpha', value:0.5},
            {type:'rect', color:'#0c3816', pos:[7, 7], height:3, width:3}
        ],
        'explosion':[
            {type:'dynamic', value:'explosion'}
        ],
        'shield':[
            {type:'block', color:SHIP_STANDARD},
            {type:'circle', color:'#ffff98', pos:[5,5], radius:4},
            {type:'circle', color:'#1c4226', pos:[5,5], radius:3},
            {type:'circle', color:SHIP_STANDARD, pos:[5,5], radius:2}
        ],
        'energy-shield':[
            {type:'alpha', value:0.3},
            {type:'rect', color:'gold', pos:[-1, -1], width:12, height:12},
            {type:'alpha', value:0.2},
            {type:'circle', color:'yellow', pos:[5,5], radius:10}
        ],
        'electro-magnet':[
            {type:'rect', pos:[0, 5], width:10, height:5, color:SHIP_STANDARD},
            {type:'rect', pos:[2, 0], width:2, height:5, color:'gold'},
            {type:'rect', pos:[6, 0], width:2, height:5, color:'gold'},
            {color:'#1c4226', type:'rect', pos:[0, 5], width:10, height:2}
        ],
        'counter':[
            {type:'dynamic', value:'counter'}
        ],
        'none':[
            {type:'block', color:'#ccc'},
            {type:'font', color:'red', font:'10px Arial', pos:[3, 8], text:'x'}
        ]
    };
});