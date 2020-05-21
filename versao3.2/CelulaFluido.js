class CelulaFluido
{
  
  constructor(exemplo = {})
  {
        var {
            x = 0,
            y = 0,
            w = 0,
            h = 0,
            vetorXBorda1 = 0,
            vetorXBorda2 = 0,
            vetorYBorda1 = 0,
            vetorYBorda2 = 0,
            densidade = 0
        } = exemplo;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.posX = this.x*this.w;
        this.posY = this.y*this.h;
        this.vetorXBorda1 = vetorXborda1;
        this.vetorYBorda1 = vetorYborda1;
        this.vetorXBorda2 = vetorXborda2;
        this.vetorYBorda2 = vetorYborda2;
        this.destinoX = this.posX+(this.vetorXBorda1 + this.vetorXBorda2)/2;
        this.destinoY = this.posY+(this.vetorYBorda1 + this.vetorYBorda2)/2;
        this.densidade = densidade;
    } 


    desenhaQuadrado(ctx){
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.posX,this.posY,this.w, this.h);
        ctx.fillStyle = "white";
        ctx.font = "10px Verdana";
        ctx.fillText("Densidade:"+this.densidade,this.posX+5,this.posY+10);
        ctx.fillText("Vetor X:"+Math.floor(this.vetorX),this.posX+5,this.posY+20);
        ctx.fillText("Vetor Y:"+Math.floor(this.vetorY),this.posX+5,this.posY+30);
        ctx.fillText("("+this.x+" , "+this.y+")",this.posX+5,this.posY+40);
    }
    
    desenharVelocidadeCelula(ctx){

        vetorX = (this.vetorXBorda1 + this.vetorXBorda2)/2;
        vetorY = (this.vetorYBorda1 + this.vetorYBorda2)/2;
    
        this.destinoX = (this.posX+vetorX);
        this.destinoY = (this.posY+vetorY);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.posX-this.w/2,this.posY-this.h/2);
        ctx.lineTo(this.destinoX-this.w/2,this.destinoY-this.h/2);
        //console.log(this.posX +" - "+this.vetorX+" = "+Number(this.vetorX+this.posX));
        ctx.stroke();
        /*if(this.vetorX!=0 || this.vetorY!=0)
        {
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.strokeStyle = "red";
            if(this.vetorX!=0 ||this.vetorY!=0)
            ctx.arc(this.destinoX+this.w/2,this.destinoY+this.h/2, 1, 0, Math.PI * 2, true);  
            ctx.stroke();
        }*/
    }
    
    desenharDensidadeCelula(ctx){
    
        ctx.fillStyle = "rgb("+this.densidade+","+this.densidade+","+this.densidade+")";
        //ctx.fillStyle = "rgb(0,0,"+this.densidade+")";
        ctx.fillRect(this.posX,this.posY,this.w, this.h);
        //ctx.fillStyle = "red";
        //ctx.font = "10px Verdana";
    }
    
    addForcaExterna(forcaExterna,dt){
        this.vetorX+=forcaExterna.vetorX*dt;
        this.vetorY+=forcaExterna.vetorY*dt;
    
        this.destinoX = this.posX+this.vetorX;
        this.destinoY = this.posY+this.vetorY;
    }
    
    addDensidade(densidade){
        this.densidade += densidade;
    }
}