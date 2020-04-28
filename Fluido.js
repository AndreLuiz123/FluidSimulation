function CelulaFluido(exemplo = {})
{
    var {
        x = 0,
        y = 0,
        w = 0,
        h = 0,
        vetorX = 0,
        vetorY = 0,
        densidade = 0
    } = exemplo;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.posX = this.x*this.w;
    this.posY = this.y*this.h;
    this.vetorX = vetorX;
    this.vetorY = vetorY;
    this.destinoX = this.posX+this.vetorX;
    this.destinoY = this.posY+this.vetorY;
    this.densidade = densidade;

} 
CelulaFluido.prototype = new CelulaFluido({});
CelulaFluido.constructor = CelulaFluido;

CelulaFluido.prototype.desenhaQuadrado = function(ctx){
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.posX,this.posY,this.w, this.h);
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Densidade:"+this.densidade,this.posX+5,this.posY-5);
    ctx.fillText("Vetor X:"+this.vetorX,this.posX+5,this.posY-10);
    ctx.fillText("Vetor Y:"+this.vetorY,this.posX+5,this.posY-15);
}

CelulaFluido.prototype.desenharVelocidadeCelula = function(ctx){

    this.destinoX = this.posX+this.vetorX;
    this.destinoY = this.posY+this.vetorY;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.posX+this.w/2,this.posY+this.h/2);
    ctx.lineTo(this.destinoX+this.w/2,this.destinoY+this.h/2);
    ctx.stroke();
}

CelulaFluido.prototype.desenharDensidadeCelula = function(ctx){

    ctx.fillStyle = "rgb("+this.densidade+","+this.densidade+","+this.densidade+")";
    ctx.fillRect(this.posX,this.posY,this.w, this.h);
    ctx.fillStyle = "red";
    ctx.font = "10px Verdana";
    //ctx.fillText("Densidade:"+this.densidade,this.posX+5,this.posY+10);
    //ctx.fillText("Vetor X:"+this.vetorX,this.posX+5,this.posY+20);
    //ctx.fillText("Vetor Y:"+this.vetorY,this.posX+5,this.posY+30);
}

CelulaFluido.prototype.addForcaExterna = function(forcaExterna,dt){
    this.vetorX+=forcaExterna.vetorX*dt;
    this.vetorY+=forcaExterna.vetorY*dt;

    this.destinoX = this.posX+this.vetorX;
    this.destinoY = this.posY+this.vetorY;
}

CelulaFluido.prototype.addDensidade = function(densidade){
    this.densidade += densidade;
}

function Fluido(exemplo = {})
{
    var {
        tam = 3,
        dt = 1,
        constDiff = 0.25,
        acuracy = 0
    } = exemplo;

    this.tam = tam;
    this.dt = dt;
    this.grid = [];
    this.gridVelocidade = [];
    this.gridVelocidade0 = [];
    this.gridDensidade = [];
    this.gridDensidade0 = [];
    this.constDiff = constDiff;
    this.acuracy = acuracy;
} 
Fluido.prototype = new Fluido({});
Fluido.constructor = Fluido;

Fluido.prototype.criarGrids = function(){

    for(var i=0; i<this.tam; i++)
    {
        this.grid[i] = [];
        for(var j=0; j<this.tam; j++)
        {
            var cell = new CelulaFluido({x:i, y:j, w:512/this.tam, h:512/this.tam});
            this.grid[i].push(cell);
        }
    }
    
    this.gridDensidade0 = this.grid;

    for(var i=0; i<this.tam; i++)
    {
        this.gridDensidade[i] = [];
        for(var j=0; j<this.tam; j++)
        {
            var cell = new CelulaFluido({x:i, y:j, w:512/this.tam, h:512/this.tam});
            this.gridDensidade[i].push(cell);
        }
    }
}


Fluido.prototype.desenharFluido = function(ctx)
{
    for(var i=0; i<this.tam; i++)
        for(var j=0; j<this.tam; j++)
        {
            this.grid[i][j].desenhaQuadrado(ctx);
            
        }    
}

Fluido.prototype.projection = function()
{
    for(var i=0; i<this.tam; i++)
    for(var j=0; j<this.tam; j++)
    {
        
    }
}

Fluido.prototype.advection = function(grid, grid0, atributo='densidade')
{
    
}

Fluido.prototype.diffusion = function(grid, grid0,atributo='densidade')
{
    this.lin_solve(grid,grid0,atributo);
}

Fluido.prototype.lin_solve = function(grid, grid0, atributo='densidade')
{
    for(var a; a<this.acuracy; a++){
        for(var i=0; i<this.tam; i++)
        for(var j=0; j<this.tam; j++)
        {
            grid[i][j][atributo] = grid0[i][j][atributo] + this.constDiff*(grid[i+1][j][atributo] + grid[i-1][j][atributo] + grid[i][j+1][atributo] + grid[i][j-1][atributo])/(1+4*this.constDiff);
        }
        this.set_bnd(grid,grid0,atributo);
    }
}

Fluido.prototype.set_bnd = function(b, grid,atributo='densidade')
{
    for(var i =1; i<this.tam-1; i++)
    {
        grid[0][i][atributo] = b==1? -grid[1][i][atributo] : grid[1][i][atributo];
        grid[this.tam-1][i][atributo] = b==1? -grid[this.tam-2][i][atributo] : grid[this.tam-2][i][atributo];
    }

    for(var j =1; j<this.tam-1; j++)
    {
        grid[j][0][atributo] = b==2? -grid[j][1][atributo] : grid[j][1][atributo];
        grid[j][this.tam-1][atributo] = b==2? -grid[j][this.tam-2][atributo] : grid[j][this.tam-2][atributo];
    }
    
    grid[0][0][atributo] = 0.5*(grid[1][0][atributo] + grid[0][1][atributo]);
    grid[0][this.tam-1][atributo] = 0.5*(grid[0][this.tam-2][atributo] + grid[1][this.tam-1][atributo]);
    grid[this.tam-1][this.tam-1][atributo] = 0.5*(grid[this.tam-1][this.tam-2][atributo] + grid[this.tam-2][this.tam-1][atributo]);
    grid[this.tam-1][0][atributo] = 0.5*(grid[this.tam-1][1][atributo] + grid[this.tam-2][0][atributo]);   
}

Fluido.prototype.swap = function(x,y)
{
    // remove all elements from x into a temporary array
    var temp = x.splice(0, x.length);
    // then copy y into x
    x.push.apply(x, y);
    // clear y, then copy temp into it
    y.length = 0;
    y.push.apply(y, temp);
}