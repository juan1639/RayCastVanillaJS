import { Escenarios } from "./escenarios.js";

export class Settings
{
    static menuPreJuego = document.getElementById('pre-menu');
    static selectFPS = document.getElementById('fps');
    static selectDim = document.getElementById('dimensiones');
    static selectSmooth = document.getElementById('smoothing');

    static botonera = document.getElementById('botonera');
    static botonUp = document.getElementById('boton__up');
    static botoneLe = document.getElementById('boton__le');
    static botoneRi = document.getElementById('botone__ri');
    static botoneDo = document.getElementById('botone__do');
    
    static canvas = document.getElementById('canvas');
	static ctx = canvas.getContext('2d');

    static FPS = 100;
    
    //  Tamaño de los tiles 64x64
    static tamTile = 64;

    //  DIMENSIONES EN PIXELS DEL CANVAS
    static canvasAncho = Escenarios.nivel_1[0].length * Settings.tamTile;
    static canvasAlto = Escenarios.nivel_1.length * Settings.tamTile;

    //  REESCALA-CANVAS (Default)
    static reescalaCanvas =
    {
        X: 1120,
        Y: 630
    };

    static FOV = 60;
    static FOV_MEDIO = Settings.FOV / 2;

    static estado =
    {
        menuConfig: true,
        enJuego: false
    };

    static modo3D = true;// true = Pseudo3D, false = Mapa2D
    static renderConTexturas = true;
    static modoSmoothing = false;

    static animaArma = 0;
    static seleccArma = 0;
    static recargando = 0;

    //	CARGAMOS TILES
	static tiles = new Image();
	static tilesVert = new Image();

    //  Cargamos las imagenes de las armas jugador
    static imgPistola = new Image();
    static imgPistolaRecargar = new Image();
    static imgEscopeta = new Image();
    static imgEscopetaRecargar = new Image();
    
    //	Cargamos las imagenes para los SPRITES
	static imgArmor = new Image();
	static imgPlanta = new Image();
	static imgMesa = new Image();
    
    // array con la distancia a cada pared (con cada rayo)
    static zBuffer = [];

    static PUNTITOS =
    {
        MAPA2D: {
            ANCHO: 6,
            ALTO: 6,
        }
    };
    
    static COLORES =
    {
        //SUELO: '#752300'
        //SUELO: '#474747',
        SUELO: '#685900',
        CIELO: '#8CBED6',
        PARED_CLARO: '#909090',
        PARED_OSCURO: '#737373',
        FOV_2D: '#ffff99',
        PUNTITO_SPRITE: '#ff3909',
        PUNTITO_JUGADOR: '#35ff11',
    };

    //  Cargamos los audios
    static sonidoPistola = new Audio("./audio/disparocorto.mp3");
    static sonidoEscopeta = new Audio("./audio/disparo.mp4");
    static sonidoEscopetaCarga = new Audio("./audio/cargar.mp3");
}
