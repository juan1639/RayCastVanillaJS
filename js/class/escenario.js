import { Settings } from "../settings.js";

export class Level
{
	constructor(canvas, context, array)
    {
		this.canvas = canvas;
		this.ctx = context;
		this.matriz = array;
		
		//DIMENSIONES MATRIZ
		this.altoM  = this.matriz.length;
		this.anchoM = this.matriz[0].length;
		
		//DIMENSIONES REALES CANVAS
		this.altoC = this.canvas.height;
		this.anchoC = this.canvas.width;
		
		//TAMAÑO DE LOS TILES
		//this.altoT = parseInt(this.altoC / this.altoM);
		//this.anchoT = parseInt(this.anchoC / this.anchoM);
		this.altoT = Settings.tamTile;
		this.anchoT = Settings.tamTile;
	}

	colision(x, y)
    {
		if (this.matriz[y][x] !== 0)
        {
            return true;
        }
		return false;	
	}

	tile(x, y)
    {
		var casillaX = parseInt(x / this.anchoT);		
		var casillaY = parseInt(y / this.altoT);

		return (this.matriz[casillaY][casillaX]);
	}

	dibuja()
    {
		var color;

		for(var y = 0; y < this.altoM; y ++)
        {
			for(var x = 0; x < this.anchoM; x++)
            {
				if (this.matriz[y][x] !== 0)
                {
					color = Settings.COLORES.PARED_CLARO;
                }
				else
                {
					color = Settings.COLORES.SUELO;
                }
				
				this.ctx.fillStyle = color;
				this.ctx.fillRect(x * this.anchoT, y * this.altoT, this.anchoT, this.altoT);
			}
		}
	}
}
