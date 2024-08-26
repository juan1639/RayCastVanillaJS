import { Level } from "./class/escenario.js";
import { Player } from './class/jugador.js';
import { Settings } from "./settings.js";
import {
	cambiaModo,
	convierteRadianes,
	distanciaEntrePuntos,
	sueloCielo,
	reescalarCanvas,
	borraCanvas
} from "./functions/functions.js";

// ----------------------------------------------------------------------
//	OBJETOS
// ----------------------------------------------------------------------
var escenario;
var jugador;
//var ray;

var sprites = [];	// array con los sprites

// ----------------------------------------------------------------------
// TECLADO (keydown)
// ----------------------------------------------------------------------
document.addEventListener('keydown',function(e)
{
	switch(e.keyCode){
		
		case 38:
			jugador.arriba();
		break;
		
		case 40:
			jugador.abajo();
		break;
		
		case 39:
			jugador.derecha();
		break;
		
		case 37:
			jugador.izquierda();
		break;
		
	}
});

// ----------------------------------------------------------------------
// TECLADO (keyup)
// ----------------------------------------------------------------------
document.addEventListener('keyup',function(e)
{		
	switch(e.keyCode){	
		
		case 38:
			jugador.avanzaSuelta();
		break;
		
		case 40:
			jugador.avanzaSuelta();
		break;
		
		case 39:
			jugador.giraSuelta();
		break;
		
		case 37:
			jugador.giraSuelta();
		break;
		
		case 32:
			Settings.modo3D = cambiaModo(Settings.modo3D);
		break;

		case 16:
			Settings.renderConTexturas = cambiaModo(Settings.renderConTexturas);
		break;
	}
});

// -------------------------------------------------------------------------------------
//	SPRITES
// -------------------------------------------------------------------------------------
const FOVRadianes = convierteRadianes(Settings.FOV);
const FOV_medio	  = convierteRadianes(Settings.FOV / 2);

class Sprite
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

		if (diferenciaAngulo < -3.14159)
		{
			diferenciaAngulo += 2.0 * 3.14159;
		}

		if (diferenciaAngulo > 3.14159)
		{
			diferenciaAngulo -= 2.0 * 3.14159;
		}

		diferenciaAngulo = Math.abs(diferenciaAngulo);

		if	(diferenciaAngulo < FOV_medio)
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
		const {ctx, canvasAncho, canvasAlto, FOV, zBuffer} = Settings;

		this.actualizaDatos();

		// punto mapa (Borrar)
		if (!Settings.modo3D)
		{
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(this.x-3, this.y-3, 6,6);
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
			ctx.imageSmoothingEnabled = false;	// PIXELAMOS LA IMAGEN

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

function inicializaSprites()
{
	const {imgArmor, imgPlanta} = Settings;

	imgArmor.src = "img/armor.png";
	imgPlanta.src = "img/planta.png";
	
	//	CREAMOS LOS OBJETOS PARA LAS IMÁGENES
	sprites[0] = new Sprite(300, 120, imgArmor);
	sprites[1] = new Sprite(150, 150, imgArmor);
	sprites[2] = new Sprite(320, 300, imgPlanta);
	sprites[3] = new Sprite(300, 380, imgPlanta);
}

// -------------------------------------------------------------------------------------
//	ALGORITMO DEL PINTOR, ORDENAMOS LOS SPRITES DE MÁS LEJANO AL JUGADOR A MÁS CERCANO
// -------------------------------------------------------------------------------------
function renderSprites()
{
	// NOTA: HACER EL ALGORITMO DE ORDENACIÓN MANUAL
		
	// ALGORITMO DE ORDENACIÓN SEGÚN DISTANCIA (ORDEN DESCENDENTE)
	// https://davidwalsh.name/array-sort

	sprites.sort(function(obj1, obj2) {
		// Ascending: obj1.distancia - obj2.distancia
		// Descending: obj2.distancia - obj1.distancia
		return obj2.distancia - obj1.distancia;
	});

	// DIBUJAMOS LOS SPRITES UNO POR UNO
	for (let i = 0; i < sprites.length; i ++)
	{
		sprites[i].dibuja();
	}
}

// ============================================================================
//	FUNCION INICIALIZADORA
//	
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () =>
{
	const {
		canvas, ctx,
		FPS,
		canvasAncho, canvasAlto,
		tiles,
		nivel_1,
		reescalaCanvas
	} = Settings;

	tiles.src= "img/walls.png";

	//	MODIFICA EL TAMAÑO DEL CANVAS
	canvas.width = canvasAncho;
	canvas.height = canvasAlto;

	escenario = new Level(canvas, ctx, nivel_1);
	jugador = new Player(ctx, escenario, 100, 100);

	//	CARGAMOS LOS SPRITES DESPUÉS DEL ESCENARIO Y EL JUGADOR
	inicializaSprites();

	//	EMPEZAMOS A EJECUTAR EL BUCLE PRINCIPAL
	setInterval(
		function()
		{
			buclePrincipal();
		}, 1000 / FPS
	);
	
	//	AMPLIAMOS EL CANVAS CON CSS
	reescalarCanvas(reescalaCanvas.X, reescalaCanvas.Y);
});

function buclePrincipal()
{
	const {modo3D, COLORES} = Settings;

	borraCanvas();

	if (!modo3D)
	{
		escenario.dibuja();
	}

	if (modo3D)
	{
		sueloCielo(COLORES.CIELO, COLORES.SUELO);
	}
  
	jugador.dibuja();

	renderSprites();
}
