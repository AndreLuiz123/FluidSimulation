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
    //console.log(this.destinoX+" "+this.vetorX);
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
        dt = 1
    } = exemplo;

    this.tam = tam;
    this.dt = dt;
    this.grid = [];
    this.gridVelocidade = [];
    this.gridVelocidade0 = [];
    this.gridDensidade = [];
    this.gridDensidade0 = [];

    
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

    for(var i=0; i<this.tam; i++)
    {
        this.gridVelocidade0[i] = [];
        for(var j=0; j<this.tam; j++)
        {
            var cell = new CelulaFluido({x:i, y:j, w:512/this.tam, h:512/this.tam});
            this.gridVelocidade0[i].push(cell);
        }
    }

    for(var i=0; i<this.tam; i++)
    {
        this.gridVelocidade[i] = [];
        for(var j=0; j<this.tam; j++)
        {
            var cell = new CelulaFluido({x:i, y:j, w:512/this.tam, h:512/this.tam});
            this.gridVelocidade[i].push(cell);
        }
    }
}

Fluido.prototype.desenharFluido = function(ctx)
{
    /*for(var i=0; i<this.tam; i++)
        for(var j=0; j<this.tam; j++)
        {
            this.grid[i][j].desenhaQuadrado(ctx);
            
        }*/
    
    this.desenharDensidade(ctx);

    //this.desenharVelocidade(ctx);
}

Fluido.prototype.desenharVelocidade = function(ctx)
{
    for(var i=0; i<this.tam; i++)
        for(var j=0; j<this.tam; j++)
        {
            this.gridDensidade0[i][j].desenharVelocidadeCelula(ctx);
        }
}

Fluido.prototype.desenharDensidade = function(ctx)
{
    for(var i=0; i<this.tam; i++)
        for(var j=0; j<this.tam; j++)
        {
            this.gridDensidade0[i][j].desenharDensidadeCelula(ctx);
        }
}

Fluido.prototype.addForcasExternas = function(forcasExternas,dt)
{
    for(var i=0; i<this.tam; i++)
        for(var j=0; j<this.tam; j++)
        {
            this.grid[i][j].addForcaExterna(forcasExternas[i][j],dt);
        }
}

Fluido.prototype.addDensidade = function(densidade,dt)
{
    
}

Fluido.prototype.addAdvection = function()
{
    for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.gridDensidade[i][j].densidade = this.bad_advection(i,j);
            this.gridDensidade[i][j].vetorX = this.bad_advectionVecX(i,j);
            this.gridDensidade[i][j].vetorY = this.bad_advectionVecY(i,j);
        }
    }
    /*for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.gridDensidade0[i][j].densidade = this.gridDensidade[i][j].densidade;
            this.gridDensidade0[i][j].vetorX = this.gridDensidade[i][j].vetorX; 
            this.gridDensidade0[i][j].vetorY = this.gridDensidade[i][j].vetorY;
        }
    }*/
}

Fluido.prototype.bad_advection = function(i,j)
{
    var velhoX=0, velhoY=0;
    velhoX = i - this.dt*this.gridDensidade0[i][j].vetorX;
    
    velhoY = j - this.dt*this.gridDensidade0[i][j].vetorY; 
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
    retorno = this.gridDensidade0[velhoX][velhoY].densidade; 

    return retorno;
}

Fluido.prototype.bad_advectionVecX = function(i,j)
{
    var velhoX=0, velhoY=0;
    velhoX = i - this.dt*this.gridDensidade0[i][j].vetorX;
    
    velhoY = j - this.dt*this.gridDensidade0[i][j].vetorY; 
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
    retorno = this.gridDensidade0[velhoX][velhoY].vetorX; 

    return retorno;
}

Fluido.prototype.bad_advectionVecY = function(i,j)
{
    var velhoX=0, velhoY=0;
    velhoX = i - this.dt*this.gridDensidade0[i][j].vetorX;
    
    velhoY = j - this.dt*this.gridDensidade0[i][j].vetorY; 
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
    retorno = this.gridDensidade0[velhoX][velhoY].vetorY; 

    return retorno;
}
Fluido.prototype.addDiffusion = function()
{
    for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.gridDensidade[i][j].densidade = this.good_difusion(i,j);
        }
    }
    //this.grid = this.gridDensidade0;
    for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.gridDensidade0[i][j].densidade = this.gridDensidade[i][j].densidade;
        }
    }

}

Fluido.prototype.bad_difusion = function(i,j)
{   
    var retorno=this.gridDensidade0[i][j].densidade;
    var aux=0;
    var constDiff = 0.25;
    if(i>0)
    {
        retorno+=this.gridDensidade0[i-1][j].densidade*constDiff;
        aux++;
    }
    if(i<this.tam-1)
    {
        retorno+=this.gridDensidade0[i+1][j].densidade*constDiff;
        aux++;
    }
    if(j>0)
    {
        retorno+=this.gridDensidade0[i][j-1].densidade*constDiff;
        aux++;
    }
    if(j<this.tam-1)
    {
        retorno+=this.gridDensidade0[i][j+1].densidade*constDiff;
        aux++;
    }

    retorno-=aux*this.gridDensidade0[i][j].densidade*constDiff;

    if(retorno<0)
        retorno=0;

    return retorno;
}

Fluido.prototype.good_difusion = function(i,j)
{
    var retorno=this.gridDensidade0[i][j].densidade;
    var aux=0;
    var constDiff = 0.25;
    if(i>0)
    {
        retorno+=this.gridDensidade[i-1][j].densidade*constDiff;
        aux++;
    }
    if(i<this.tam-1)
    {
        retorno+=this.gridDensidade[i+1][j].densidade*constDiff;
        aux++;
    }
    if(j>0)
    {
        retorno+=this.gridDensidade[i][j-1].densidade*constDiff;
        aux++;
    }
    if(j<this.tam-1)
    {
        retorno+=this.gridDensidade[i][j+1].densidade*constDiff;
        aux++;
    }

    retorno/=(1+aux*constDiff);

    if(retorno<0)
        retorno=0;

    return retorno;
}

Fluido.prototype.projection = function()
{
    for(var i=0; i<this.tam; i++)
    for(var j=0; j<this.tam; j++)
    {
        this.gridVelocidade[i][j].vetorX = this.projectionAux1(i,j);
        this.gridVelocidade[i][j].vetorY = this.projectionAux2(i,j);

        this.gridVelocidade0[i][j].vetorX = 0;
        this.gridVelocidade0[i][j].vetorY = 0;
    }

    for(var i=0; i<this.tam; i++)
    for(var j=0; j<this.tam; j++)
    {
        this.gridVelocidade0[i][j].vetorX = this.projectionAux3(i,j,'vetorX');
        this.gridVelocidade0[i][j].vetorY = this.projectionAux3(i,j,'vetorY');
    }

    for(var i=0; i<this.tam; i++)
    for(var j=0; j<this.tam; j++)
    {
        this.gridDensidade[i][j].vetorX -= this.projectionAux4(i,j);
        this.gridDensidade[i][j].vetorY -= this.projectionAux5(i,j);
    }

    for(var i=0; i<this.tam; i++)
    {
        for(var j=0; j<this.tam; j++)
        {
            this.gridDensidade0[i][j].densidade = this.gridDensidade[i][j].densidade;
            this.gridDensidade0[i][j].vetorX = this.gridDensidade[i][j].vetorX; 
            this.gridDensidade0[i][j].vetorY = this.gridDensidade[i][j].vetorY;
        }
    }

}

Fluido.prototype.projectionAux1 = function(i,j)
{
    var retorno = 0;

    if(i>0)
    {
       retorno -= -0.5*(this.gridDensidade[i-1][j].vetorX)/this.tam;
    }

    if(i<this.tam-1)
    {
        retorno += -0.5*(this.gridDensidade[i+1][j].vetorX)/this.tam;
    }

    return retorno;

}

Fluido.prototype.projectionAux2 = function(i,j)
{
    var retorno = 0; 

    if(j>0)
    {
        retorno -= -0.5*(this.gridDensidade[i][j-1].vetorY)/this.tam;
    }

    if(j<this.tam-1)
    {
        retorno += -0.5*(this.gridDensidade[i][j+1].vetorY)/this.tam;
    }

    return retorno;
}

Fluido.prototype.projectionAux3 = function(i,j,vetor)
{
    var retorno = this.gridVelocidade[i][j][vetor];
    var aux = 0;

    if(i>0)
    {
       retorno += this.gridVelocidade0[i-1][j][vetor];
       aux++; 
    }

    if(i<this.tam-1)
    {
        retorno += this.gridVelocidade0[i+1][j][vetor];
        aux++;
    }

    if(j>0)
    {
        retorno += this.gridVelocidade0[i][j-1][vetor];
        aux++;
    }

    if(j<this.tam-1)
    {
        retorno += this.gridVelocidade0[i][j+1][vetor];
        aux++;
    }

    retorno/=aux;

    return retorno;
}

Fluido.prototype.projectionAux4 = function(i,j)
{
    var retorno = 0;

    if(i>0)
    {
       retorno -= -0.5*(this.gridVelocidade0[i-1][j].vetorX)*this.tam;
    }

    if(i<this.tam-1)
    {
        retorno += -0.5*(this.gridVelocidade0[i+1][j].vetorX)*this.tam;
    }

    return retorno;

}

Fluido.prototype.projectionAux5 = function(i,j)
{
    var retorno = 0; 

    if(j>0)
    {
        retorno -= -0.5*(this.gridVelocidade0[i][j-1].vetorY)*this.tam;
    }

    if(j<this.tam-1)
    {
        retorno += -0.5*(this.gridVelocidade0[i][j+1].vetorY)*this.tam;
    }

    return retorno;
}