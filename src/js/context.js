define(function(){

    function drawTriangle(ctx, x1, y1, x2, y2, x3, y3){
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.fill();
        ctx.closePath();
    }

    function drawCircle(ctx, x, y, r){
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    }

    return function(ctx, instruction, display){
        if(display && instruction.color){
            ctx.fillStyle = instruction.color;
        }
        switch(instruction.type){
            case 'rect':
                ctx.fillRect(instruction.pos[0], instruction.pos[1], instruction.width, instruction.height);
                break;
            case 'block':
                ctx.fillRect(0, 0, 10, 10);
                break;
            case 'circle':
                drawCircle(ctx, instruction.pos[0], instruction.pos[1], instruction.radius);
                break;
            case 'triangle':
                drawTriangle(ctx,
                            instruction.pos[0][0], 
                            instruction.pos[0][1], 
                            instruction.pos[1][0], 
                            instruction.pos[1][1], 
                            instruction.pos[2][0],
                            instruction.pos[2][1]);
                break;
            case 'alpha':
                if(!display){break;}
                ctx.globalAlpha = instruction.value;
                break;
            case 'font':
                ctx.font = instruction.font
                ctx.fillText(instruction.text, instruction.pos[0], instruction.pos[1]);
            default:
                break;
        }
    }

    
});

