import { Component, OnInit } from '@angular/core';
/** Importar Librerias  */
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { MarcadorI } from '../model/marcador.interface';
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  //DuocPuente    -33.598208429252715, -70.57865623980268
  lat: number = -33.598208429252715;
  lng: number = -70.57865623980268;
  map=null;
  constructor(
    private geoLoca: Geolocation,
    private loadingCtrl: LoadingController) { }
  ngOnInit() {
    this.cargarMapa();
  }
  async cargarMapa() {
    const cargar = await this.loadingCtrl.create({
      message: "Cargando Mapa...."
    });
    await cargar.present();
    const ubicacion = {
      lat: this.lat,
      lng: this.lng
    };
    const mapaHtml: HTMLElement = document.getElementById("map");
    this.map = new google.maps.Map(mapaHtml, {
      center: ubicacion,
      zoom: 20
    });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      cargar.dismiss();

      const marcador = new google.maps.Marker({
        position: {
          lat: ubicacion.lat,
          lng: ubicacion.lng
        },
        zoom: 8,
        map: this.map,
        title: 'Sede'
      });
      this.cargarMarcardores();
    });
  }
  
  cargarMarcardores(){
    this.listaMarcadores.forEach(marcador=>{
      this.agregarMarcadores(marcador);
    })
  }

  agregarMarcadores(ubicacion:MarcadorI){
    const marcador = new google.maps.Marker({
      position: {
        lat: ubicacion.position.lat,
        lng: ubicacion.position.lng
      },
      zoom: 8,
      map: this.map,
      title:ubicacion.title
    });
  }

  listaMarcadores: MarcadorI[] = [{
    position: {
      lat: -33.59804332761758,
      lng: -70.5751251937849
    },
    title: 'Colegio  San Carlos'
  },
  {
    position: {
      lat: -33.5751695,
      lng: -70.60354650000001
    },
    title: 'Casita'
  }
  ];
}
