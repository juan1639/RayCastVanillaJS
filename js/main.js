import { Level } from "./class/escenario.js";
import { Player } from './class/jugador.js';
import { Arma } from "./class/armas/armas.js";
import { Sprite } from "./class/sprites/sprite.js";
import { Settings } from "./settings.js";
import { Escenarios } from "./escenarios.js";

import {
	startGameValues,
	cambiaModo,
	sueloCielo,
	reescalarCanvas,
	borraCanvas
} from "./functions/functions.js";

// ----------------------------------------------------------------------
//	OBJETOS
// ----------------------------------------------------------------------
var botonComenzar = document.getElementById('boton-comenzar');
var escenario;
var jugador;
//var ray;

var sprites = [];	// array con los sprites
var armas = [];	// array con las armas

// ----------------------------------------------------------------------
// 	EVENTOS (Menu Config pre-juego)
// ----------------------------------------------------------------------
botonComenzar.addEventListener('click', (e) =>
{
	console.log(e.target.id);

	if (Settings.estado.menuConfig)
	{
		startGameValues();
	}
});

// ----------------------------------------------------------------------
// TECLADO (keydown)
// ----------------------------------------------------------------------
document.addEventListener('keydown', function(e)
{
	//console.log(e.keyCode);
	
	switch(e.keyCode)
	{
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
document.addEventListener('keyup', function(e)
{		
	switch(e.keyCode)
	{
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
			console.log('disparo!');
			Settings.animaArma = 20;// FPS duracion
		break;
		
		case 17:
			Settings.modo3D = cambiaModo(Settings.modo3D);
		break;

		case 16:
			Settings.seleccArma ++;
			if (Settings.seleccArma > 1)
			{
				Settings.seleccArma = 0;
			}
		break;
	}
});

// ----------------------------------------------------------------------
// Mobile (touchstart)
// ----------------------------------------------------------------------
document.addEventListener('touchstart', function(e)
{
	console.log(e.target.id);
	
	switch(e.target.id)
	{
		case 'boton__up':
			jugador.arriba();
		break;
		
		case 'boton__do':
			jugador.abajo();
		break;
		
		case 'boton__ri':
			jugador.derecha();
		break;
		
		case 'boton__le':
			jugador.izquierda();
		break;

		case 'boton__fire':
			console.log('disparo!');
			Settings.animaArma = 20;// FPS duracion
		break;

		case 'boton__mapa':
			Settings.modo3D = cambiaModo(Settings.modo3D);
		break;

		case 'boton__texturas':
			Settings.seleccArma ++;
			if (Settings.seleccArma > 1)
			{
				Settings.seleccArma = 0;
			}
		break;
	}
});

// ----------------------------------------------------------------------
// Mobile (touchend)
// ----------------------------------------------------------------------
document.addEventListener('touchend', function(e)
{
	//console.log(e.target.id);
	
	switch(e.target.id)
	{
		case 'boton__up':
			jugador.avanzaSuelta();
		break;
		
		case 'boton__do':
			jugador.avanzaSuelta();
		break;
		
		case 'boton__ri':
			jugador.giraSuelta();
		break;
		
		case 'boton__le':
			jugador.giraSuelta();
		break;
	}
});

function inicializaArmasJugador()
{
	const {
		imgPistola,
		imgPistolaRecargar,
		imgEscopeta,
		imgEscopetaRecargar,
		canvasAncho,
		canvasAlto
	} = Settings;

	imgPistola.src = "img/dPist.png";
	imgPistolaRecargar.src = "img/dPist.png";
	imgEscopeta.src = "img/dEscop.png";
	imgEscopetaRecargar.src = "img/dRecargarEscop.png";

	armas[0] = new Arma(canvasAncho / 2, canvasAlto, imgPistola, imgPistolaRecargar);
	armas[1] = new Arma(canvasAncho / 2, canvasAlto, imgEscopeta, imgEscopetaRecargar);
}

function dibujaArmasJugador()
{
	armas[Settings.seleccArma].dibuja();
}

function inicializaSprites()
{
	const {imgArmor, imgPlanta, imgMesa, tamTile} = Settings;

	const midTamTile = tamTile / 2;

	imgArmor.src = "img/armor.png";
	imgPlanta.src = "img/planta.png";
	imgMesa.src = "img/mesa.png";
	
	//	CREAMOS LOS OBJETOS PARA LAS IMÁGENES
	sprites[0] = new Sprite(8 * tamTile, 8 * tamTile + midTamTile, imgArmor);
	sprites[1] = new Sprite(5 * tamTile + midTamTile, 2 * tamTile + midTamTile, imgArmor);
	sprites[2] = new Sprite(6 * tamTile, 5 * tamTile, imgPlanta);
	sprites[3] = new Sprite(1 * tamTile + midTamTile, 8 * tamTile + midTamTile, imgPlanta);
	sprites[4] = new Sprite(8 * tamTile, 4 * tamTile + midTamTile, imgMesa);
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
		tamTile,
		canvasAncho,
		canvasAlto,
		tiles,
		tilesVert,
		reescalaCanvas
	} = Settings;

	tiles.src = "img/walls7.png";
	tilesVert.src = "img/walls7vert.png";

	console.log(tiles.width, tilesVert.height);
	console.log(tiles.width, tilesVert.width);

	//	MODIFICA EL TAMAÑO DEL CANVAS
	canvas.width = canvasAncho;
	canvas.height = canvasAlto;

	console.log(canvas.width);
	console.log(canvas.height);

	const midTamTile = tamTile / 2;

	escenario = new Level(canvas, ctx, Escenarios.nivel_1);
	jugador = new Player(ctx, escenario, 1 * tamTile + midTamTile, 1 * tamTile + midTamTile);

	//	CARGAMOS LAS ARMAS DEL JUGADOR
	inicializaArmasJugador();

	//	CARGAMOS LOS SPRITES DESPUÉS DEL ESCENARIO Y EL JUGADOR
	inicializaSprites();

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
	dibujaArmasJugador();
}

export { jugador, buclePrincipal };
