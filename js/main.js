import { Level } from "./class/escenario.js";
import { Settings } from "./settings.js";
import {
	cambiaModo,
	convierteRadianes,
	normalizaAngulo,
	distanciaEntrePuntos,
	sueloTecho,
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
var zBuffer = [];	// array con la distancia a cada pared (con cada rayo)

// ----------------------------------------------------------------------
// TECLADO (keydown)
// ----------------------------------------------------------------------
document.addEventListener('keydown',function(e) {
	
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
document.addEventListener('keyup',function(e) {
		
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
	}
});

class Rayo
{
	constructor(context, escenario, x, y, anguloJugador, incrAngulo, columna)
	{	
		this.ctx = context;
		this.escenario = escenario;
		
		this.x = x;
		this.y = y;
		
		this.incrementoAngulo = incrAngulo;
		this.anguloJugador = anguloJugador;
		this.angulo = anguloJugador + this.incrementoAngulo;

		this.wallHitX =0;
		this.wallHitY = 0;
		this.wallHitXHorizontal = 0;
		this.wallHitYHorizontal = 0;
		this.wallHitXVertical = 0;
		this.wallHitYVertical = 0;

		this.columna = columna;		// para saber la columna que hay que renderizar
		this.distancia = 0;			// para saber el tamaño de la pared al hacer el render

		this.pixelTextura = 0;		// pixel / columna de la textura
		this.idTextura = 0;			// valor de la matriz

		this.distanciaPlanoProyeccion = (Settings.canvasAncho / 2) / Math.tan(Settings.FOV / 2);

		this.hCamara = 0;			// movimiento vertical de la camara
	}

	cast()
	{
		const {canvasAncho, canvasAlto, tamTile} = Settings;

		this.xIntercept = 0;
		this.yIntercept = 0;
		
		this.xStep = 0;
		this.yStep = 0;
		
		//	TENEMOS QUE SABER EN QUÉ DIRECCIÓN VA EL RAYO
		this.abajo = false;
		this.izquierda = false;

		if (this.angulo < Math.PI)
		{
			this.abajo = true;
		}

		if (this.angulo > Math.PI/2 && this.angulo < 3 * Math.PI / 2)
		{
			this.izquierda = true;
		}

		// -------------------------------------------------------------
		// 	HORIZONTAL									
		// -------------------------------------------------------------
		var choqueHorizontal = false;// detectamos si hay un muro

		//	BUSCAMOS LA PRIMERA INTERSECCIÓN HORIZONTAL (X,Y):
		this.yIntercept = Math.floor(this.y / tamTile) * tamTile;// el Y es fácil, se redondea por abajo para conocer el siguiente
		
		//	SI APUNTA HACIA ABAJO, INCREMENTAMOS 1 TILE
		if (this.abajo)
		{
			this.yIntercept += tamTile;		//no se redondea por abajo, sino por arriba, así que sumamos 1 a la Y
		}

		//	SE LE SUMA EL CATETO ADYACENTE
		var adyacente = (this.yIntercept - this.y) / Math.tan(this.angulo);	//calculamos la x con la tangente
		this.xIntercept = this.x + adyacente;

		//	CALCULAMOS LA DISTANCIA DE CADA PASO
		this.yStep = tamTile;								// al colisionar con la Y, la distancia al próximo es la del tile
		this.xStep = this.yStep / Math.tan(this.angulo);	// calculamos el dato con la tangente

		//	SI VAMOS HACIA ARRIBA O HACIA LA IZQUIERDA, EL PASO ES NEGATIVO
		if (!this.abajo)
		{
			this.yStep = -this.yStep;
		}

		//	CONTROLAMOS EL INCREMENTO DE X, NO SEA QUE ESTÉ INVERTIDO
		if ((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0))
		{
			this.xStep *= -1;
		}

		//	COMO LAS INTERSECCIONES SON LÍNEAS, TENEMOS QUE AÑADIR UN PIXEL EXTRA O QUITARLO PARA QUE ENTRE...
		//	...DENTRO DE LA CASILLA
		var siguienteXHorizontal = this.xIntercept;
		var siguienteYHorizontal = this.yIntercept;
		
		//	SI APUNTA HACIA ARRIBA, FORZAMOS '-1 Pixel' EXTRA
		if (!this.abajo)
		{
			siguienteYHorizontal--;
		}

		//	BUCLE PARA BUSCAR EL PUNTO DE COLISIÓN
		while(!choqueHorizontal)
		{
			var casillaX = Math.floor(siguienteXHorizontal / tamTile);		
			var casillaY = Math.floor(siguienteYHorizontal / tamTile);		
			
			if (this.escenario.colision(casillaX, casillaY))
			{
				choqueHorizontal = true;
				this.wallHitXHorizontal = siguienteXHorizontal;
				this.wallHitYHorizontal = siguienteYHorizontal;
			}
			else
			{
				siguienteXHorizontal += this.xStep;
				siguienteYHorizontal += this.yStep;
			}
		}
		
		// ---------------------------------------------------------------------
		// VERTICAL									
		// ---------------------------------------------------------------------
		var choqueVertical = false;	//detectamos si hay un muro
		
		//	BUSCAMOS LA PRIMERA INTERSECCIÓN VERTICAL (X,Y)
		this.xIntercept = Math.floor(this.x / tamTile) * tamTile;// el x es fácil, se redondea por abajo para conocer el siguiente
		
		//	SI APUNTA HACIA LA DERECHA, INCREMENTAMOS 1 TILE
		if (!this.izquierda)
		{
			this.xIntercept += tamTile;// No se redondea por abajo, sino por arriba, así que sumamos 1 a la Xs
		}
		
		//	SE LE SUMA EL CATETO OPUESTO
		var opuesto = (this.xIntercept - this.x) * Math.tan(this.angulo); 
		this.yIntercept = this.y + opuesto;

		//	CALCULAMOS LA DISTANCIA DE CADA PASO
		this.xStep = tamTile;// al colisionar con la X, la distancia al próximo es la del tile
		
		//	SI VA A LA IZQUIERDA, INVERTIMOS
		if (this.izquierda)
		{
			this.xStep *= -1;
		}

		this.yStep = tamTile * Math.tan(this.angulo);// calculamos el dato con la tangente
		
		//	CONTROLAMOS EL INCREMENTO DE Y, NO SEA QUE ESTÉ INVERTIDO
		if ((!this.abajo && this.yStep > 0) || (this.abajo && this.yStep < 0))
		{
			this.yStep *= -1;
		}
		
		// COMO LAS INTERSECCIONES SON LÍNEAS, TENEMOS QUE AÑADIR UN PIXEL EXTRA O QUITARLO PARA QUE ENTRE...
		// ...DENTRO DE LA CASILLA
		var siguienteXVertical = this.xIntercept;
		var siguienteYVertical = this.yIntercept;

		//	SI APUNTA HACIA IZQUIERDA, FORZAMOS UN PIXEL EXTRA
		if(this.izquierda)
		{
			siguienteXVertical--;
		}

		//	BUCLE PARA BUSCAR EL PUNTO DE COLISIÓN
		while (!choqueVertical && (
			siguienteXVertical >= 0 && siguienteYVertical >= 0 && siguienteXVertical < canvasAncho && siguienteYVertical < canvasAlto)
		){
			//OBTENEMOS LA CASILLA (REDONDEANDO POR ABAJO)
			var casillaX = Math.floor(siguienteXVertical / tamTile);		
			var casillaY = Math.floor(siguienteYVertical / tamTile);

			if (this.escenario.colision(casillaX, casillaY))
			{
				choqueVertical = true;
				this.wallHitXVertical = siguienteXVertical;
				this.wallHitYVertical = siguienteYVertical;
			}
			else
			{
				siguienteXVertical += this.xStep;
				siguienteYVertical += this.yStep;
			}
		}

		// ======================================================================
		//	MIRAMOS CUÁL ES EL MÁS CORTO (VERTICAL / HORIZONTAL)
		// ----------------------------------------------------------------------
		var distanciaHorizontal = 9999;		
		var distanciaVertical = 9999;
		
		if (choqueHorizontal)
		{
			distanciaHorizontal = distanciaEntrePuntos(this.x, this.y, this.wallHitXHorizontal, this.wallHitYHorizontal);
		}
		
		if (choqueVertical)
		{
			distanciaVertical = distanciaEntrePuntos(this.x, this.y, this.wallHitXVertical, this.wallHitYVertical);
		}
		
		//	COMPARAMOS LAS DISTANCIAS
		if (distanciaHorizontal < distanciaVertical)
		{
			this.wallHitX = this.wallHitXHorizontal;
			this.wallHitY = this.wallHitYHorizontal;
			this.distancia = distanciaHorizontal;
			//	PIXEL TEXTURA
			var casilla = parseInt(this.wallHitX / tamTile);
			this.pixelTextura = this.wallHitX - (casilla * tamTile);
			
			//	ID TEXTURA
			this.idTextura = this.escenario.tile(this.wallHitX, this.wallHitY);
		}
		else
		{
			this.wallHitX = this.wallHitXVertical;
			this.wallHitY = this.wallHitYVertical;
			this.distancia = distanciaVertical;
			//	PIXEL TEXTURA
			var casilla = parseInt(this.wallHitY / tamTile) * tamTile;
			this.pixelTextura = this.wallHitY - casilla;
			//	ID TEXTURA
			this.idTextura = this.escenario.tile(this.wallHitX, this.wallHitY);
		}

		//	CORREGIMOS EL EFECTO OJO DE PEZ
		this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));

		//	GUARDAMOS LA INFO EN EL ZBUFFER
		zBuffer[this.columna] = this.distancia;
	}

	// -----------------------------------------------------------------
	// 	HAY QUE NORMALIZAR EL ÁNGULO PARA EVITAR QUE SALGA NEGATIVO
	// -----------------------------------------------------------------
	setAngulo(angulo)
	{
		this.anguloJugador = angulo;
		this.angulo = normalizaAngulo(angulo + this.incrementoAngulo);
	}

	color()
	{
		//https://www.w3schools.com/colors/colors_shades.asp
		
		//36 posibles matices
		var paso = 526344;		//Todos son múltiplos de #080808 = 526344(decimal);
		
		var bloque = parseInt(canvasAlto / 36);
		var matiz = parseInt(this.distancia / bloque);
		var gris = matiz * paso;

		var colorHex = "#" + gris.toString(16);// convertimos a hexadecimal (base 16)
		
		return(colorHex);
	}

	renderPared()
	{
		const {ctx, canvasAlto, tiles} = Settings;

		var altoTile = 500;// Es la altura que tendrá el muro al renderizarlo
		var alturaMuro = (altoTile / this.distancia) * this.distanciaPlanoProyeccion;

		//	CALCULAMOS DONDE EMPIEZA Y ACABA LA LÍNEA, CENTRÁNDOLA EN PANTALLA
		var y0 = parseInt(canvasAlto / 2) - parseInt(alturaMuro / 2);
		var y1 = y0 + alturaMuro;
		var x = this.columna;

		//	VARIAMOS LA ALTURA DE LA CÁMARA
		var velocidad = 0.2;
		var amplitud = 20;
		
		var altura = 0;// borrar cuando usemos el código de abajo

		// DIBUJAMOS *** SIN Texturas ***
		//ctx.fillStyle = 'green';
		//ctx.fillRect(x, y0, 1, y0 - y1);
		//return;

		//	DIBUJAMOS CON TEXTURA
		var altoTextura = 64;
		var alturaTextura = y0 - y1;
		ctx.imageSmoothingEnabled = false;// PIXELAMOS LA IMAGEN

		ctx.drawImage(
			tiles,
			this.pixelTextura,
			((this.idTextura -1 ) * altoTextura),
			this.pixelTextura,
			63,
			x,
			y1 + altura,
			1,
			alturaTextura
		);	
	}

	dibuja()
	{
		// -----------------------------------------------------
		// 	LANZAMOS EL RAYO
		// -----------------------------------------------------
		this.cast();

		if (Settings.modo3D)
		{
			this.renderPared();
		}

		if (!Settings.modo3D)
		{
			// -------------------------------------------------
			// LÍNEA DIRECCIÓN
			// -------------------------------------------------
			var xDestino = this.wallHitX;    
			var yDestino = this.wallHitY;	
			
			this.ctx.beginPath();
			this.ctx.moveTo(this.x, this.y);
			this.ctx.lineTo(xDestino, yDestino);
			this.ctx.strokeStyle = "red";
			this.ctx.stroke();
		}
	}
}

// =================================================================================
class Player
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
			//	PUNTO (Jugador)
			this.ctx.fillStyle = '#FFFFFF';
			this.ctx.fillRect(this.x-3, this.y-3, 6,6);

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
		const {ctx, canvasAncho, canvasAlto, FOV} = Settings;

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
	borraCanvas();

	if (!Settings.modo3D)
	{
		escenario.dibuja();
	}

	if (Settings.modo3D)
	{
		sueloTecho();
	}
  
	jugador.dibuja();

	renderSprites();
}
