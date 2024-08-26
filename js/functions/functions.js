//-----------------------------------------------------------------------
// FUNCIONES VARIAS
//  
// ----------------------------------------------------------------------
import { Settings } from "../settings.js";

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
	Settings.estado.menuConfig = false;
	Settings.estado.enJuego = true;

	Settings.canvas.style.display = "block";
	Settings.menuPreJuego.style.display = "none";
}

//  PINTA COLORES BÁSICOS PARA SUELO Y TECHO
function sueloCielo(colorCielo, colorSuelo)
{
    const {ctx} = Settings;

	ctx.fillStyle = colorCielo;
	ctx.fillRect(0, 0, 500, 250);
	
	ctx.fillStyle = colorSuelo;
	ctx.fillRect(0, 250, 500, 500);
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
