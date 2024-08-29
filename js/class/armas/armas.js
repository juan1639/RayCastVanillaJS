import { Settings } from "../../settings.js";

export class Arma
{
	constructor(x, y, imagen, imagenRecargar, sonido, id)
	{
		this.x = x;
		this.y = y;
        this.id = id;

        imagen.onload = () =>
        {
            this.imagen = imagen;

            this.ancho = Math.floor(this.imagen.width / 3);
            this.alto = Math.floor(this.imagen.height);

            console.log(this.ancho, this.alto);
        }

        imagenRecargar.onload = () =>
        {
            this.imagenRecargar = imagenRecargar;

            this.anchoRec = Math.floor(this.imagenRecargar.width / 3);
            this.altoRec = Math.floor(this.imagenRecargar.height);
            
            console.log(this.anchoRec, this.altoRec);
        }

        this.sonidoArma = sonido;

		this.visible = true;
		this.scale = 2;

        this.impactos = false;

        this.instanciaParticulas();
	}

	dibuja()
	{
		const {ctx} = Settings;

		this.actualiza();

        this.particulas.forEach(parti => {
            parti.dibuja();
        });

		if (Settings.modo3D && this.visible)
		{
            const anchoSc = this.ancho * this.scale;
            const altoSc = this.alto * this.scale;

            let actualizaClip = 0;

            if (Settings.animaArma > 0)
            {
                if (Settings.animaArma === 1)
                {
                    Settings.recargando = 20;

                    if (this.id === 1)
                    {
                        Settings.sonidoEscopetaCarga.play();
                    }
                }
                actualizaClip = 2;
            }
            
            if (Settings.animaArma > 10)
            {
                actualizaClip = 1;
            }

            if (Settings.recargando > 0)
            {
                this.recargaEscopeta(ctx);
            }
            else
            {
                ctx.drawImage(this.imagen, 
                    0 + actualizaClip * this.ancho, 0, this.ancho, this.alto,
                    this.x - anchoSc / 2, this.y - altoSc, anchoSc, altoSc
                );
            }
		}
    }

    actualiza()
    {
        if (Settings.animaArma > 0)
        {
            Settings.animaArma --;
        }

        if (Settings.recargando > 0)
        {
            Settings.recargando --;
        }
    }

    sonido()
    {
        this.sonidoArma.play();
    }

    recargaEscopeta(ctx)
    {
        let actualizaClip = 0;

        const anchoSc = this.anchoRec * this.scale;
        const altoSc = this.altoRec * this.scale;

        if (Settings.recargando > 0)
        {
            actualizaClip = 2;
        }
        
        if (Settings.recargando > 10)
        {
            actualizaClip = 1;
        }

        ctx.drawImage(this.imagenRecargar, 
            0 + actualizaClip * this.anchoRec, 0, this.anchoRec, this.alto,
            this.x - anchoSc / 2, this.y - altoSc, anchoSc, altoSc
        );
    }

    instanciaParticulas()
    {
        this.particulas = [];

        for (let i = 0; i < Settings.NRO_PARTICULAS_IMPACTO; i ++)
        {
            this.particulas.push(new Particulas());
        }
    }
}

// =======================================================================================
export class Particulas
{
    static impactos = false;

    constructor()
	{
        this.inicializaValores();
	}

    dibuja()
    {
        if (!Particulas.impactos) return;

        Settings.ctx.fillStyle = this.chooseRndColor();

        Settings.ctx.fillRect(this.x, this.y, this.size, this.size);

        this.x += Math.cos(this.ang) * this.vel;
        this.y += Math.sin(this.ang) * this.vel;
    }

    static iniciaTemporizador()
    {
        Particulas.impactos = true;

        setTimeout(() => {
            Particulas.impactos = false;
        }, 1200);
    }

    inicializaValores()
    {
        const {canvasAncho, canvasAlto} = Settings;

        this.x = canvasAncho / 2;
        this.y = canvasAlto / 2;
        this.size = Math.floor(Math.random() * 3) + 2;
        this.ang = Math.floor(Math.random() * 360);
        this.vel = Math.floor(Math.random() * 8) + 12;// (12 min vel)
    }

    chooseRndColor()
    {
        return 'rgb(255,' + (Math.floor(Math.random() * 200) + 55).toString() + ',12)';
    }
}
