import { Settings } from "../../settings.js";
import { jugador } from '../../main.js';
import { convierteRadianes, distanciaEntrePuntos } from "../../functions/functions.js";

export class Sprite
{
	constructor(x, y, imagen)
	{
		this.x = x;
		this.y = y;
		this.imagen = imagen;

		this.distancia = 0;
		this.angulo  = 0;

		this.visible = false;
	}

	//	CALCULAMOS EL ÁNGULO CON RESPECTO AL JUGADOR
	calculaAngulo()
	{
		var vectX = this.x - jugador.x;
		var vectY = this.y - jugador.y;

		var anguloJugadorObjeto = Math.atan2(vectY, vectX);
		var diferenciaAngulo = jugador.anguloRotacion - anguloJugadorObjeto;

		if (diferenciaAngulo < -Math.PI)
		{
			diferenciaAngulo += 2.0 * Math.PI;
		}

		if (diferenciaAngulo > Math.PI)
		{
			diferenciaAngulo -= 2.0 * Math.PI;
		}

		diferenciaAngulo = Math.abs(diferenciaAngulo);

		if	(diferenciaAngulo < convierteRadianes(Settings.FOV_MEDIO))
		{
			this.visible = true;
		}
		else
		{
			this.visible = false;
		}
	}

	calculaDistancia()
	{
		this.distancia = distanciaEntrePuntos(jugador.x, jugador.y, this.x, this.y)
	}

	actualizaDatos()
	{
		this.calculaAngulo();
		this.calculaDistancia();
	}

	dibuja()
	{
		const {ctx, canvasAncho, canvasAlto, FOV, zBuffer, modoSmoothing, PUNTITOS} = Settings;

		this.actualizaDatos();

		// punto mapa (Borrar)
		if (!Settings.modo3D)
		{
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(
				this.x - PUNTITOS.MAPA2D.ANCHO / 2,
				this.y - PUNTITOS.MAPA2D.ALTO / 2,
				PUNTITOS.MAPA2D.ANCHO,
				PUNTITOS.MAPA2D.ALTO
			);
		}

		if (this.visible)
		{
			var altoTile = 500;		//Es la altura que tendrá el SPRITE al renderizarlo
			var distanciaPlanoProyeccion = (canvasAncho / 2) / Math.tan(FOV / 2);
			var alturaSprite = (altoTile / this.distancia) * distanciaPlanoProyeccion;

			//CALCULAMOS DONDE EMPIEZA Y ACABA LA LÍNEA, CENTRÁNDOLA EN PANTALLA (EN VERTICAL)
			var y0 = parseInt(canvasAlto / 2) - parseInt(alturaSprite / 2);
			var y1 = y0 + alturaSprite;

			var altoTextura = 64;
			var anchoTextura = 64;
					
			var alturaTextura = y0 - y1;
			var anchuraTextura = alturaTextura;	// LOS SPRITES SON CUADRADOS

			//---------------------------------------------------------------------------
			// CALCULAMOS LA COORDENADA X DEL SPRITE
			//---------------------------------------------------------------------------
			var dx = this.x - jugador.x;
			var dy = this.y - jugador.y;
			
			var spriteAngle = Math.atan2(dy, dx) - jugador.anguloRotacion;
			
			var viewDist = 500;

			//console.log(distanciaPlanoProyeccion);

			var x0 = Math.tan(spriteAngle) * viewDist;
			var x = (canvasAncho/2 + x0 - anchuraTextura/2);

			// -----------------------------------------------------------------------------
			ctx.imageSmoothingEnabled = modoSmoothing;	// PIXELAMOS LA IMAGEN

			// 	Proporción de anchura de X (según nos acerquemos, se verán más anchas las líneas verticales)
			var anchuraColumna = alturaTextura/altoTextura;

			// -------------------------------------------------------------------------------------------
			//	DIBUJAMOS EL SPRITE COLUMNA A COLUMNA PARA EVITAR QUE SE VEA TRAS UN MURO
			//	LO HAGO CON DOS BUCLES, PARA ASEGURARME QUE DIBUJO LÍNEA A LÍNEA Y NO TIRAS DE LA IMAGEN 
			// -------------------------------------------------------------------------------------------
			for (let i = 0; i < anchoTextura; i++)
			{
				for (let j = 0; j < anchuraColumna; j++)
				{
					var x1 = parseInt(x + ((i - 1) * anchuraColumna) + j);	
					
					//	COMPARAMOS LA LÍNEA ACTUAL CON LA DISTANCIA DEL ZBUFFER PARA DECIDIR SI DIBUJAMOS
					if (zBuffer[x1] > this.distancia)
					{
						ctx.drawImage(this.imagen, i, 0, 1, altoTextura-1, x1, y1, 1, alturaTextura);
					}
				}
			}
		}
	}
}
