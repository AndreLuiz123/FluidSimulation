class Fluido{

    constructor(exemplo = {}){

        var {
            tam = 64,
            dt = 0.1,
            constDiff = 0.0,
            viscosidade = 0.0,
            acuracy = 1
        } = exemplo;
    
        this.tam = tam;
        this.tamOriginal = this.tam+2;
        this.dt = dt;
        this.grid = [];
        this.grid0 = [];
        this.constDiff = constDiff;
        this.viscosidade = viscosidade;
        this.acuracy = acuracy;
        this.div = [];
        this.p = [];

    }

    criarGrids(){

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
                var obj;
                this.div[i].push(obj = {numero:0});
            }
        }
    
        for(var i=0; i<this.tamOriginal; i++)
        {
            this.p[i] = [];
            for(var j=0; j<this.tamOriginal; j++)
            {
                var obj;
                this.p[i].push(obj = {numero:0});
            }
        }
    }
    
    desenharFluido(ctx,atributo='densidade')
    {
        for(var i=1; i<this.tam+1; i++)
            for(var j=1; j<this.tam+1; j++)
            {
                this.grid[i][j].desenhaQuadrado(ctx);
            }    
    }
    
    desenharFluidoDensidade(ctx,atributo='densidade')
    {
        for(var i=1; i<this.tam+1; i++)
            for(var j=1; j<this.tam+1; j++)
            {
                this.grid[i][j].desenharDensidadeCelula(ctx);
            }    
    }
    
    desenharFluidoVelocidade(ctx,atributo='densidade')
    {
        for(var i=1; i<this.tam+1; i++)
            for(var j=1; j<this.tam+1; j++)
            {
                this.grid[i][j].desenharVelocidadeCelula(ctx);
            }  
    }
    
    diffusion(atributo,diff,b)
    {
        //console.log("?");
        var constante = diff*this.dt*this.tam*this.tam;
        this.lin_solve(this.grid,this.grid0,atributo,constante,1+4*constante,b);
    }
    
    lin_solve(grid, grid0, atributo,constante,cRecip,b)
    {
        
        for(var a=0; a<this.acuracy; a++){
            for(var i=1; i<this.tam+1; i++)
            for(var j=1; j<this.tam+1; j++)
            {
                grid[i][j][atributo] = (grid0[i][j][atributo] + constante*(grid[i+1][j][atributo] + grid[i-1][j][atributo] + grid[i][j+1][atributo] + grid[i][j-1][atributo]))/cRecip;   
            }
            this.set_bnd(b,grid,atributo);
        }
    }
    
    advection(atributo, b)
    {
        var i0, j0, i1, j1, s0, s1, t0, t1;
        var x, y;
        var dt0 = this.dt*this.tam;
        
        for(var i=1; i<this.tam+1; i++)
        for(var j=1; j<this.tam+1; j++)
        {
            x = i - dt0*this.grid0[i][j].vetorX;//(this.tam*this.tam);
            y = j - dt0*this.grid0[i][j].vetorY;//(this.tam*this.tam);
            
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
    
    projection()
    {
        for(var i=1; i<this.tam+1; i++)
        for(var j=1; j<this.tam+1; j++)
        {
            this.div[i][j].numero = -0.5*(this.grid[i+1][j].vetorX - this.grid[i-1][j].vetorX + this.grid[i][j+1].vetorY - this.grid[i][j-1].vetorY)/this.tam; 
            this.p[i][j].numero = 0;
            
        }
        
        this.set_bnd(0,this.div,'numero');
        this.set_bnd(0,this.p,'numero');
        
        this.lin_solve(this.p,this.div,'numero',1,4,0);
        
        for(var i=1; i<this.tam+1; i++)
        for(var j=1; j<this.tam+1; j++)
        {
            this.grid[i][j].vetorX -= 0.5*(this.p[i+1][j].numero-this.p[i-1][j].numero)*this.tam;
            this.grid[i][j].vetorY -= 0.5*(this.p[i][j+1].numero-this.p[i][j-1].numero)*this.tam;      
        }
        
        this.set_bnd(1,this.grid,'vetorX');
        this.set_bnd(2,this.grid,'vetorY');
        
    }
    
    set_bnd(b,grid,atributo)
    {
        for(var i=1; i<=this.tam; i++)
        {
            grid[0][i][atributo] = b===1? -grid[1][i][atributo] : grid[1][i][atributo];
            grid[this.tam+1][i][atributo] = b===1? -grid[this.tam][i][atributo] : grid[this.tam][i][atributo];
            grid[i][0][atributo] = b===2? -grid[i][1][atributo] : grid[i][1][atributo];
            grid[i][this.tam+1][atributo] = b===2? -grid[i][this.tam][atributo] : grid[i][this.tam][atributo];
        }
        
        grid[0][0][atributo] = 0.5*(grid[1][0][atributo] + grid[0][1][atributo]);
        grid[0][this.tam+1][atributo] = 0.5*(grid[0][this.tam][atributo] + grid[1][this.tam+1][atributo]);
        grid[this.tam+1][0][atributo] = 0.5*(grid[this.tam+1][1][atributo] + grid[this.tam][0][atributo]);   
        grid[this.tam+1][this.tam+1][atributo] = 0.5*(grid[this.tam+1][this.tam][atributo] + grid[this.tam][this.tam+1][atributo]);
    }
    
    atualizarGrid0(atributo)
    {
        for(var i=0; i<this.tamOriginal; i++)
        {
            for(var j=0; j<this.tamOriginal; j++)
            {
                this.grid0[i][j][atributo] = this.grid[i][j][atributo];
            }
        }   
    }

}