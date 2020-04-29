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
    ctx.fillText("Vetor X:"+this.vetorX,this.posX+5,this.posY+20);
    ctx.fillText("Vetor Y:"+this.vetorY,this.posX+5,this.posY+30);
    ctx.fillText("("+this.x+" , "+this.y+")",this.posX+5,this.posY+40);
    //console.log(this.vetorX);

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
        tam = 30,
        dt = 1,
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
            var cell = new CelulaFluido({x:i, y:j, w:512/this.tam, h:512/this.tam});
            this.grid0[i].push(cell);
        }
    }
}


Fluido.prototype.desenharFluido = function(ctx,atributo='densidade')
{
    for(var i=0; i<this.tamOriginal; i++)
        for(var j=0; j<this.tamOriginal; j++)
        {
            //this.grid[i][j].desenhaQuadrado(ctx);
            this.grid[i][j].desenharDensidadeCelula(ctx);
        }    
}

Fluido.prototype.projection = function()
{
    for(var i=0; i<this.tam; i++)
    for(var j=0; j<this.tam; j++)
    {
        
    }
}

Fluido.prototype.advection = function(atributo, b)
{
    var auxiliarX=0, auxiliarY=0;
    var celulaAntigaX=0, celulaAntigaY=0;

    for(var i=1; i<this.tamOriginal-1; i++)
    for(var j=1; j<this.tamOriginal-1; j++)
    {
        auxiliarX = this.grid[i][j].posX + this.grid[i][j].w/2 - this.grid[i][j].vetorX;
        auxiliarY = this.grid[i][j].posY + this.grid[i][j].h/2 - this.grid[i][j].vetorY;

        celulaAntigaX = Math.floor(auxiliarX/this.grid[i][j].w);
        celulaAntigaY = Math.floor(auxiliarY/this.grid[i][j].h);

        if(celulaAntigaX<0)
            celulaAntigaX=0;
        else
        if(celulaAntigaX>this.tamOriginal-1)
            celulaAntigaX=this.tamOriginal-1;
        
        if(celulaAntigaY<0)
            celulaAntigaY=0;
        else
        if(celulaAntigaY>this.tamOriginal-1)
            celulaAntigaY=this.tamOriginal-1;
        
        this.grid[i][j][atributo] = this.grid0[celulaAntigaX][celulaAntigaY][atributo];
    }

    this.set_bnd(b,this.grid,atributo);
    this.atualizarGrid0();
}

Fluido.prototype.diffusion = function(atributo,b)
{
    this.lin_solve(this.grid,this.grid0,atributo,b);
}

Fluido.prototype.lin_solve = function(grid, grid0, atributo,b)
{

    for(var a=0; a<this.acuracy; a++){
        for(var i=1; i<this.tam+1; i++)
        for(var j=1; j<this.tam+1; j++)
        {
            grid[i][j][atributo] = (grid0[i][j][atributo] + this.constDiff*(grid[i+1][j][atributo] + grid[i-1][j][atributo] + grid[i][j+1][atributo] + grid[i][j-1][atributo]))/(1+4*this.constDiff);
            //console.log("("+i+","+j+") = "+ grid[i][j][atributo]);
        }
        this.set_bnd(b,grid,atributo);
        //this.set_bnd(0,grid,atributo);
    }
    
    this.atualizarGrid0();
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

Fluido.prototype.bad_set_bnd = function()
{
    for(var j = 1; j<this.tamOriginal-1; j++)
    {
        this.grid[0][j].densidade = (grid0[0][j].densidade + this.constDiff*(grid[1][j].densidade + grid[0][j+1].densidade + grid[0][j-1].densidade))/(1+3*this.constDiff);
        this.grid[this.tamOriginal-1][j].densidade = (grid0[this.tamOriginal-1][j].densidade + this.constDiff*(grid[this.tamOriginal-2][j].densidade + grid[this.tamOriginal-1][j+1].densidade + grid[this.tamOriginal-1][j-1].densidade))/(1+3*this.constDiff);
    }

    for(var i = 1; i<this.tamOriginal-1; i++)
    {
        this.grid[i][0].densidade = (grid0[i][0].densidade + this.constDiff*(grid[i][1].densidade + grid[i+1][0].densidade + grid[i-1][0].densidade))/(1+3*this.constDiff);
        this.grid[i][this.tamOriginal-1].densidade = (grid0[i][this.tamOriginal-1].densidade + this.constDiff*(grid[i][this.tamOriginal-2].densidade + grid[i+1][this.tamOriginal-1].densidade + grid[i-1][this.tamOriginal-1].densidade))/(1+3*this.constDiff);
    }

    grid[0][0].densidade = 0.5*(grid[1][0].densidade + grid[0][1].densidade);
    grid[0][this.tam-1].densidade = 0.5*(grid[0][this.tam-2].densidade + grid[1][this.tam-1].densidade);
    grid[this.tam-1][this.tam-1].densidade = 0.5*(grid[this.tam-1][this.tam-2].densidade + grid[this.tam-2][this.tam-1].densidade);
    grid[this.tam-1][0].densidade = 0.5*(grid[this.tam-1][1].densidade + grid[this.tam-2][0].densidade);   

}

Fluido.prototype.atualizarGrid0 = function()
{
    for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.grid0[i][j].densidade = this.grid[i][j].densidade;
            this.grid0[i][j].vetorX = this.grid[i][j].vetorX; 
            this.grid0[i][j].vetorY = this.grid[i][j].vetorY;
        }
    }
}


Fluido.prototype.addAdvection = function()
{
    for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.grid[i][j].densidade = this.bad_advection(i,j);
            this.grid[i][j].vetorX = this.bad_advectionVecX(i,j);
            this.grid[i][j].vetorY = this.bad_advectionVecY(i,j);
        }
    }
    for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.grid0[i][j].densidade = this.grid[i][j].densidade;
            this.grid0[i][j].vetorX = this.grid[i][j].vetorX; 
            this.grid0[i][j].vetorY = this.grid[i][j].vetorY;
        }
    }
}

Fluido.prototype.bad_advection = function(i,j)
{
    var velhoX=0, velhoY=0;
    velhoX = i - this.dt*this.grid0[i][j].vetorX;
    
    velhoY = j - this.dt*this.grid0[i][j].vetorY; 
    //console.log("i: "+i+" - "+this.dt+" = "+velhoX+" j: "+j+" - "+this.dt+" = "+velhoY);
   
    if(velhoX>0)
    velhoX = Math.floor(velhoX);
    else
    velhoX = 0;

    if(velhoX<this.tam-1)
    velhoX = Math.floor(velhoX);
    else
    velhoX = this.tam-1;
    
    if(velhoY>0)
    velhoY = Math.floor(velhoY);
    else
    velhoY = 0;

    if(velhoY<this.tam-1)
    velhoY = Math.floor(velhoY);
    else
    velhoY = this.tam-1;

    var retorno; 
    retorno = this.grid0[velhoX][velhoY].densidade; 

    return retorno;
}

Fluido.prototype.bad_advectionVecX = function(i,j)
{
    var velhoX=0, velhoY=0;
    velhoX = i - this.dt*this.grid0[i][j].vetorX;
    
    velhoY = j - this.dt*this.grid0[i][j].vetorY; 
    //.log("i: "+i+" - "+this.dt+" = "+velhoX+" j: "+j+" - "+this.dt+" = "+velhoY);
   
    if(velhoX>0)
    velhoX = Math.floor(velhoX);
    else
    velhoX = 0;

    if(velhoX<this.tam-1)
    velhoX = Math.floor(velhoX);
    else
    velhoX = this.tam-1;
    
    if(velhoY>0)
    velhoY = Math.floor(velhoY);
    else
    velhoY = 0;

    if(velhoY<this.tam-1)
    velhoY = Math.floor(velhoY);
    else
    velhoY = this.tam-1;
    
    var retorno; 
    retorno = this.grid0[velhoX][velhoY].vetorX; 

    return retorno;
}

Fluido.prototype.bad_advectionVecY = function(i,j)
{
    var velhoX=0, velhoY=0;
    velhoX = i - this.dt*this.grid0[i][j].vetorX;
    
    velhoY = j - this.dt*this.grid0[i][j].vetorY; 
    //console.log("i: "+i+" - "+this.dt+" = "+velhoX+" j: "+j+" - "+this.dt+" = "+velhoY);
   
    if(velhoX>0)
    velhoX = Math.floor(velhoX);
    else
    velhoX = 0;

    if(velhoX<this.tam-1)
    velhoX = Math.floor(velhoX);
    else
    velhoX = this.tam-1;
    
    if(velhoY>0)
    velhoY = Math.floor(velhoY);
    else
    velhoY = 0;

    if(velhoY<this.tam-1)
    velhoY = Math.floor(velhoY);
    else
    velhoY = this.tam-1;

    var retorno; 
    retorno = this.grid0[velhoX][velhoY].vetorY; 

    return retorno;
}