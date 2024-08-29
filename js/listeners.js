import { Settings } from './settings.js';
import { jugador, dispararRecargar } from './main.js';
import { cambiaModo } from './functions/functions.js';

// ----------------------------------------------------------------------
// TECLADO (keydown)
// ----------------------------------------------------------------------
const key_down = document.addEventListener('keydown', function(e)
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
const key_up = document.addEventListener('keyup', function(e)
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
            dispararRecargar();
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
const touch_start = document.addEventListener('touchstart', function(e)
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
            dispararRecargar();
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
const touch_end = document.addEventListener('touchend', function(e)
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

export {key_up, key_down, touch_start, touch_end};
