import { Settings } from "../../settings.js";

export class Arma
{
	constructor(x, y, imagen, imagenRecargar, sonido)
	{
		this.x = x;
		this.y = y;

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
	}

	dibuja()
	{
		const {ctx} = Settings;

		this.actualiza();

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
}
