import { Settings } from "../settings.js";
import { Rayo } from "./rayo.js";
import { convierteRadianes, normalizaAngulo } from "../functions/functions.js";

export class Player
{
	constructor(context, escenario, x, y)
	{
		this.ctx = context;
		this.escenario = escenario;
		
		this.x = x;
		this.y = y;
		
		this.avanza = 0;	//-1 atrás, 1 adelante
		this.gira = 0;		//-1 izquierda, 1 derecha
		
		this.anguloRotacion = 0;
		
		this.velGiro = convierteRadianes(3);		// 3 grados en radianes
		this.velMovimiento = 3;

		this.crearRayosRender();
	}

	crearRayosRender()
	{
		//	VISIÓN (RENDER)
		this.numRayos = Settings.canvasAncho;	// Cantidad de rayos que vamos a castear (los mismos que tenga el ancho del canvas)
		this.rayos = [];						// Array con todos los rayos

		//	CALCULAMOS EL ANGULO DE LOS RAYOS
		var incrementoAngulo	 = convierteRadianes(Settings.FOV / this.numRayos);
		var anguloInicial 	 	 = convierteRadianes(this.anguloRotacion - Settings.FOV_MEDIO);
		
		var anguloRayo = anguloInicial;
		
		//	CREAMOS RAYOS
		for (let i = 0; i < this.numRayos; i++)
		{	
			this.rayos[i] = new Rayo(
				this.ctx,
				this.escenario,
				this.x,
				this.y,
				this.anguloRotacion,
				anguloRayo,
				i
			);

			anguloRayo += incrementoAngulo;
		}
	}

	actualiza()
	{
		//	AVANZAMOS
		var nuevaX = this.x + this.avanza * Math.cos(this.anguloRotacion) * this.velMovimiento;
		var nuevaY = this.y + this.avanza * Math.sin(this.anguloRotacion) * this.velMovimiento;
		
		if (!this.colision(nuevaX,nuevaY))
		{
			this.x = nuevaX;
			this.y = nuevaY;
		}

		//	GIRAMOS
		this.anguloRotacion += this.gira * this.velGiro;
		this.anguloRotacion = normalizaAngulo(this.anguloRotacion);	// normalizamos
		
		
		//	ACTUALIZAMOS LOS RAYOS
		for (let i = 0; i < this.numRayos; i ++)
		{
			this.rayos[i].x = this.x;
			this.rayos[i].y = this.y;
			this.rayos[i].setAngulo(this.anguloRotacion);
		}
	}

	dibuja()
	{
		this.actualiza();

		// --------------------------------------------------------
		//	RAYOS
		// --------------------------------------------------------
		for (let i = 0; i < this.numRayos; i ++)
		{
			this.rayos[i].dibuja();
		}

		if (!Settings.modo3D)
		{
			const {PUNTITOS} = Settings;
			
			//	PUNTO (Jugador)
			this.ctx.fillStyle = Settings.COLORES.PUNTITO_JUGADOR;
			this.ctx.fillRect(
				this.x - PUNTITOS.MAPA2D.ANCHO / 2,
				this.y - PUNTITOS.MAPA2D.ALTO / 2,
				PUNTITOS.MAPA2D.ANCHO,
				PUNTITOS.MAPA2D.ALTO
			);

			//	LÍNEA DIRECCIÓN (apuntar hacia donde miramos)
			var xDestino = this.x + Math.cos(this.anguloRotacion) * 40;// 40 es la longitud de la línea
			var yDestino = this.y + Math.sin(this.anguloRotacion) * 40;

			this.ctx.beginPath();
			this.ctx.moveTo(this.x, this.y);
			this.ctx.lineTo(xDestino, yDestino);
			this.ctx.strokeStyle = "#eeeeee";
			this.ctx.stroke();
		}
	}

	colision(x, y)
	{
		var casillaX = Math.floor(x / this.escenario.anchoT);
		var casillaY = Math.floor(y / this.escenario.altoT);
		
		if (this.escenario.colision(casillaX, casillaY))
		{
			return true;
		}
		return false;
	}

	// ---------------------------------------------------
	//	LÓGICA DEL TECLADO
	// ---------------------------------------------------
	arriba()
	{
		this.avanza = 1;
	}
	
	abajo()
	{
		this.avanza = -1;
	}
	
	derecha()
	{
		this.gira = 1;
	}
	
	izquierda()
	{
		this.gira = -1;
	}

	avanzaSuelta()
	{
		this.avanza = 0;
	}
	
	giraSuelta()
	{
		this.gira = 0;
	}
}
