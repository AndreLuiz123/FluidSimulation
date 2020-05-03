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
    ctx.fillText("Densidade:"+this.densidade,this.posX+5,this.posY+10);
    ctx.fillText("Vetor X:"+Math.floor(this.vetorX),this.posX+5,this.posY+20);
    ctx.fillText("Vetor Y:"+Math.floor(this.vetorY),this.posX+5,this.posY+30);
    ctx.fillText("("+this.x+" , "+this.y+")",this.posX+5,this.posY+40);
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
        tam = 64,
        dt = 0.25,
        constDiff = 0.25,
        acuracy = 1
    } = exemplo;

    this.tam = tam;
    this.tamOriginal = this.tam+2;
    this.dt = dt;
    this.grid = [];
    this.grid0 = [];
    this.constDiff = constDiff;
    this.acuracy = acuracy;
    this.div = [];
    this.p = [];
} 
Fluido.prototype = new Fluido({});
Fluido.constructor = Fluido;

Fluido.prototype.criarGrids = function(){

    for(var i=0; i<this.tamOriginal; i++)
    {
        this.grid[i] = [];
        for(var j=0; j<this.tamOriginal; j++)
        {
            var cell = new CelulaFluido({x:i, y:j, w:512/this.tamOriginal, h:512/this.tamOriginal});
            this.grid[i].push(cell);
        }
    }

    for(var i=0; i<this.tamOriginal; i++)
    {
        this.grid0[i] = [];
        for(var j=0; j<this.tamOriginal; j++)
        {
            var cell = new CelulaFluido({x:i, y:j, w:512/this.tamOriginal, h:512/this.tamOriginal});
            this.grid0[i].push(cell);
        }
    }

    for(var i=0; i<this.tamOriginal; i++)
    {
        this.div[i] = [];
        for(var j=0; j<this.tamOriginal; j++)
        {
            this.div[i].push(obj = {numero:0});
        }
    }

    for(var i=0; i<this.tamOriginal; i++)
    {
        this.p[i] = [];
        for(var j=0; j<this.tamOriginal; j++)
        {
            this.p[i].push(obj = {numero:0});
        }
    }
}


Fluido.prototype.desenharFluido = function(ctx,atributo='densidade')
{
    for(var i=0; i<this.tamOriginal; i++)
        for(var j=0; j<this.tamOriginal; j++)
        {
            this.grid[i][j].desenhaQuadrado(ctx);
        }    
}

Fluido.prototype.desenharFluidoDensidade = function(ctx,atributo='densidade')
{
    for(var i=0; i<this.tamOriginal; i++)
        for(var j=0; j<this.tamOriginal; j++)
        {
            this.grid[i][j].desenharDensidadeCelula(ctx);
        }    
}

Fluido.prototype.desenharFluidoVelocidade = function(ctx,atributo='densidade')
{
    for(var i=0; i<this.tamOriginal; i++)
        for(var j=0; j<this.tamOriginal; j++)
        {
            this.grid[i][j].desenharVelocidadeCelula(ctx);
        }    
}

Fluido.prototype.projection = function()
{
    for(var i=1; i<this.tamOriginal-1; i++)
    for(var j=1; j<this.tamOriginal-1; j++)
    {
        this.div[i][j].numero = (this.grid[i+1][j].vetorX - this.grid[i-1][j].vetorX + this.grid[i][j+1].vetorY - this.grid[i][j-1].vetorY)/this.tamOriginal; 
        this.p[i][j].numero = 0;

    }
    
    this.set_bnd(0,this.div,'numero');
    this.set_bnd(0,this.p,'numero');
    
    
    for(var k=0; k<20; k++)
    {
        for(var i=1; i<this.tamOriginal-1; i++)
        for(var j=1; j<this.tamOriginal-1; j++)
        {
            this.p[i][j].numero = (this.div[i][j].numero+this.p[i-1][j].numero+this.p[i+1][j].numero+this.p[i][j-1].numero+this.p[i][j+1].numero)/4;
        }
        
        this.set_bnd(0,this.p,'numero');
    }
    
    for(var i=1; i<this.tamOriginal-1; i++)
    for(var j=1; j<this.tamOriginal-1; j++)
    {
        this.grid[i][j].vetorX -= 0.5*(this.p[i+1][j].numero-this.p[i-1][j].numero)*this.tamOriginal;
        this.grid[i][j].vetorY -= 0.5*(this.p[i][j+1].numero-this.p[i][j-1].numero)*this.tamOriginal;      
    }


}

Fluido.prototype.advection = function(atributo, b)
{
    var i0, j0, i1, j1, s0, s1, t0, t1;
    var x, y;
    var dt0 = this.dt*this.tam

    for(var i=1; i<this.tamOriginal-1; i++)
    for(var j=1; j<this.tamOriginal-1; j++)
    {
        x = i - dt0*this.grid[i][j].vetorX;
        y = j - dt0*this.grid[i][j].vetorY;

        if(x<0.5)
        x=0.5; 
        if(x>0.5+this.tam) 
        x=0.5+this.tam;

        i0 = Math.floor(x);
        i1 = i0+1;

        if(y<0.5)
        y=0.5; 
        if(y>0.5+this.tam) 
        y=0.5+this.tam;

        j0 = Math.floor(y);
        j1 = j0+1;

        s1 = x - i0;
        s0 = 1 - s1;

        t1 = y - j0;
        t0 = 1 - t1;

       this.grid[i][j][atributo] = s0*(t0*this.grid0[i0][j0][atributo]+t1*this.grid0[i0][j1][atributo])+s1*(t0*this.grid0[i1][j0][atributo]+t1*this.grid0[i1][j1][atributo]); 
       
    }

    this.set_bnd(b,this.grid,atributo);
}

Fluido.prototype.diffusion = function(atributo,b)
{
    this.lin_solve(this.grid,this.grid0,atributo,b);
}

Fluido.prototype.lin_solve = function(grid, grid0, atributo,b)
{

    for(var a=0; a<this.acuracy; a++){
        for(var i=1; i<this.tamOriginal-1; i++)
        for(var j=1; j<this.tamOriginal-1; j++)
        {
            grid[i][j][atributo] = (grid0[i][j][atributo] + this.constDiff*(grid[i+1][j][atributo] + grid[i-1][j][atributo] + grid[i][j+1][atributo] + grid[i][j-1][atributo]))/(1+4*this.constDiff);   
        }
        this.set_bnd(b,grid,atributo);
    }
}

Fluido.prototype.set_bnd = function(b,grid,atributo)
{
    for(var i =1; i<this.tamOriginal-1; i++)
    {
        grid[0][i][atributo] = b==1? -grid[1][i][atributo] : grid[1][i][atributo];
        grid[this.tamOriginal-1][i][atributo] = b==1? -grid[this.tamOriginal-2][i][atributo] : grid[this.tamOriginal-2][i][atributo];
    }

    for(var j =1; j<this.tamOriginal-1; j++)
    {
        grid[j][0][atributo] = b==2? -grid[j][1][atributo] : grid[j][1][atributo];
        grid[j][this.tamOriginal-1][atributo] = b==2? -grid[j][this.tamOriginal-2][atributo] : grid[j][this.tamOriginal-2][atributo];
    }
    
    grid[0][0][atributo] = 0.5*(grid[1][0][atributo] + grid[0][1][atributo]);
    grid[0][this.tamOriginal-1][atributo] = 0.5*(grid[0][this.tamOriginal-2][atributo] + grid[1][this.tamOriginal-1][atributo]);
    grid[this.tamOriginal-1][this.tamOriginal-1][atributo] = 0.5*(grid[this.tamOriginal-1][this.tamOriginal-2][atributo] + grid[this.tamOriginal-2][this.tamOriginal-1][atributo]);
    grid[this.tamOriginal-1][0][atributo] = 0.5*(grid[this.tamOriginal-1][1][atributo] + grid[this.tamOriginal-2][0][atributo]);   
}

Fluido.prototype.atualizarGrid0 = function()
{
    for(var i=0; i<this.tamOriginal; i++)
    {
        for(var j=0; j<this.tamOriginal; j++)
        {
            this.grid0[i][j].densidade = this.grid[i][j].densidade;
            this.grid0[i][j].vetorX = this.grid[i][j].vetorX; 
            this.grid0[i][j].vetorY = this.grid[i][j].vetorY;
        }
    }
    
}