import { Settings } from "../../settings.js";

export class Arma
{
	constructor(x, y, imagen, imagenRecargar)
	{
		this.x = x;
		this.y = y;
		this.imagen = imagen;
		this.imagenRecargar = imagenRecargar;

		this.visible = true;
		this.scale = 2;

        this.ancho = Math.floor(this.imagen.width / 3);
        this.alto = Math.floor(this.imagen.height);

        this.anchoRec = Math.floor(this.imagenRecargar.width / 3);
        this.altoRec = Math.floor(this.imagenRecargar.height);

        console.log(this.ancho, this.alto);
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
                actualizaClip = 2;
            }
            
            if (Settings.animaArma > 10)
            {
                actualizaClip = 1;
            }

            ctx.drawImage(this.imagen, 
                0 + actualizaClip * this.ancho, 0, this.ancho, this.alto,
                this.x - anchoSc / 2, this.y - altoSc, anchoSc, altoSc
            );
		}
    }

    actualiza()
    {
        if (Settings.animaArma > 0)
        {
            Settings.animaArma --;
        }
    }
}
