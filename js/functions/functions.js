//-----------------------------------------------------------------------
// FUNCIONES VARIAS
//  
// ----------------------------------------------------------------------
import { Settings } from "../settings.js";

function cambiaModo(modo)
{
	if (modo === 0)
    {
		return 1;
    }
    return 0;
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

//  PINTA COLORES BÁSICOS PARA SUELO Y TECHO
function sueloTecho()
{
    const {ctx} = Settings;

	ctx.fillStyle = '#777777';
	ctx.fillRect(0, 0, 500, 250);
	
	ctx.fillStyle = '#752300';
	ctx.fillRect(0, 250, 500, 500);
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
    sueloTecho,
    borraCanvas
};
