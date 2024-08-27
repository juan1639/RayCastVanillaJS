
export class Settings
{
    static menuPreJuego = document.getElementById('pre-menu');
    static selectFPS = document.getElementById('fps');
    static selectDim = document.getElementById('dimensiones');
    
    static canvas = document.getElementById('canvas');
	static ctx = canvas.getContext('2d');

    static FPS = 100;
    
    //  DIMENSIONES EN PIXELS DEL CANVAS
    static canvasAncho = 500;
    static canvasAlto = 500;

    static tamTile = 50;

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

    //	CARGAMOS TILES
	static tiles = new Image();
	static tilesVert = new Image();
    
    //	Cargamos las imagenes para los SPRITES
	static imgArmor = new Image();
	static imgPlanta = new Image();
    
    // array con la distancia a cada pared (con cada rayo)
    static zBuffer = [];
    
    static COLORES =
    {
        //SUELO: '#752300'
        SUELO: '#474747',
        CIELO: '#8CBED6',
        PARED_CLARO: '#aaaaaa',
        PARED_OSCURO: '#929292',
    };

    // ----------------------------------------------------------------------
    // NIVELES (Arrays)
    // ----------------------------------------------------------------------
    static nivel_1 = [
        [1,1,2,1,1,1,2,2,1,1],
        [1,0,0,0,0,0,0,1,1,1],
        [1,0,0,0,0,0,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,3],
        [1,0,1,2,1,0,0,0,0,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,0,0,1,0,0,3,3,1],
        [1,0,0,1,1,0,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ];

    static nivel_2 = [
        [1,1,2,1,1,1,2,2,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,2],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [1,0,0,0,1,0,0,3,3,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],

        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];
}
