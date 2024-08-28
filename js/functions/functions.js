//-----------------------------------------------------------------------
// FUNCIONES VARIAS
//  
// ----------------------------------------------------------------------
import { Settings } from "../settings.js";
import { buclePrincipal } from '../main.js';

function cambiaModo(bool)
{
	if (bool)
    {
		return false;
    }
    return true;
}

//-----------------------------------------------------------------------
// La usaremos para evitar que el ángulo crezca sin control
// una vez pasado de 2Pi, que vuelva a empezar
// usamos la función módulo
// ----------------------------------------------------------------------
function normalizaAngulo(angulo)
{
	angulo = angulo % (2 * Math.PI);
	
	if (angulo < 0)
    {
		angulo = (2 * Math.PI) + angulo;// si es negativo damos toda la vuelta en el otro sentido
	}
	
	return angulo;
}

function convierteRadianes(angulo)
{
	angulo = angulo * (Math.PI / 180);
	return angulo;
}

function distanciaEntrePuntos(x1, y1, x2, y2)
{
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2-y1)*(y2-y1));
}

function startGameValues()
{
	const {
		estado,
		canvas,
		menuPreJuego,
		selectDim,
		selectFPS,
		selectSmooth,
		reescalaCanvas,
		botonera
	} = Settings;

	estado.menuConfig = false;
	estado.enJuego = true;

	canvas.style.display = "block";
	menuPreJuego.style.display = "none";

	Settings.FPS = parseInt(selectFPS.value);
	console.log("FPS: " + Settings.FPS);

	const valoresXY = selectDim.value.split('x');
	reescalaCanvas.X = parseInt(valoresXY[0]);
	reescalaCanvas.Y = parseInt(valoresXY[1]);

	Settings.modoSmoothing = selectSmooth.value === "true" ? true : false;

	if (reescalaCanvas.X < 576)
	{
		botonera.style.display = 'flex';
	}

	//	EMPEZAMOS A EJECUTAR EL BUCLE PRINCIPAL
	setInterval(
		function()
		{
			buclePrincipal();
		}, 1000 / Settings.FPS
	);

	//	AMPLIAMOS EL CANVAS CON CSS
	reescalarCanvas(reescalaCanvas.X, reescalaCanvas.Y);
}

//  PINTA COLORES BÁSICOS PARA SUELO Y TECHO
function sueloCielo(colorCielo, colorSuelo)
{
    const {ctx, canvasAncho, canvasAlto} = Settings;

	ctx.fillStyle = colorCielo;
	ctx.fillRect(0, 0, canvasAncho, canvasAlto);
	
	ctx.fillStyle = colorSuelo;
	ctx.fillRect(0, canvasAlto / 2, canvasAncho, canvasAlto);
}

// ------------------------------------------------------------------------------------
//	MODIFICAMOS EL ESTILO CSS (por eso usamos canvas.style.width y no canvas.width)
// ------------------------------------------------------------------------------------
function reescalarCanvas(ancho, alto)
{
	Settings.canvas.style.width = ancho + "px";
	Settings.canvas.style.height = alto + "px";
}

function borraCanvas()
{
  Settings.canvas.width = canvas.width;
  Settings.canvas.height = canvas.height;
}

export {
    cambiaModo,
    normalizaAngulo,
    convierteRadianes,
    distanciaEntrePuntos,
	startGameValues,
    sueloCielo,
    reescalarCanvas,
    borraCanvas
};
