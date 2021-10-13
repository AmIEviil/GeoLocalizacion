import { Component,OnInit } from '@angular/core';
/** Importar Librerias  */
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  //DuocPuente    -33.598208429252715, -70.57865623980268
  lat:number=-33.598208429252715;
  lng:number=-70.57865623980268;
  constructor(
    private geoLoca :Geolocation,
    private loadingCtrl: LoadingController) 
    {}
    ngOnInit(){
      this.cargarMapa();
    }
    async cargarMapa(){
      const cargar= await this.loadingCtrl.create({
        message:"Cargando Mapa...."
      });
      await cargar.present();
      const ubicacion={
        lat: this.lat,
        lng: this.lng
      };
      const mapaHtml: HTMLElement = document.getElementById("map");
      const map = new google.maps.Map(mapaHtml,{
        center: ubicacion,
        zoom:12
      });
      google.maps.event.addListenerOnce(map,'idle',()=>{
        cargar.dismiss();
      });
    }
}
