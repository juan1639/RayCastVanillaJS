import { Level } from "./class/escenario.js";
import { Player } from './class/jugador.js';
import { Sprite } from "./class/sprites/sprite.js";
import { Settings } from "./settings.js";

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
document.addEventListener('keyup', function(e)
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
			console.log('disparo!');
		break;
		
		case 17:
			Settings.modo3D = cambiaModo(Settings.modo3D);
		break;

		case 16:
			Settings.renderConTexturas = cambiaModo(Settings.renderConTexturas);
		break;
	}
});

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
		tilesVert,
		nivel_1,
		reescalaCanvas
	} = Settings;

	tiles.src = "img/walls2.png";
	tilesVert.src = "img/walls2vert.png";
	
	//	MODIFICA EL TAMAÑO DEL CANVAS
	canvas.width = canvasAncho;
	canvas.height = canvasAlto;

	escenario = new Level(canvas, ctx, nivel_1);
	jugador = new Player(ctx, escenario, 100, 100);

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
}

export { jugador, buclePrincipal };
