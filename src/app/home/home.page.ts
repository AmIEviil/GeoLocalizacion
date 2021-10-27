import { Component, OnInit } from '@angular/core';
/** Importar Librerias  */
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { MarcadorI } from '../model/marcador.interface';
import { WayPoint } from '../model/WayPoints';
import { ApiService } from '../api.service';
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

  //RUTA desde mi casa al duoc
  origen={lat:-33.5751695 , lng:-70.60354650000001 }
  destino={lat:-33.598208429252715 , lng:-70.57865623980268 }

  map=null;

  //Crear un servicio de manejo de Ruta
  direcionService = new google.maps.DirectionsService();
  //crear un servicio de Render (dibujado de mapa)
  direccionDibuja = new google.maps.DirectionsRenderer();
  //crear variable donde recuperamos la direccion
  dire:string;

  constructor(
    private geoLoca: Geolocation,
    private loadingCtrl: LoadingController,
    private api:ApiService
    ) { }
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
    this.direccionDibuja.setMap(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      cargar.dismiss();

      /*const marcador = new google.maps.Marker({
        position: {
          lat: ubicacion.lat,
          lng: ubicacion.lng
        },
        zoom: 8,
        map: this.map,
        title: 'Sede'
      });
      this.cargarMarcardores();*/
      this.calcularRuta();
    });
  }
  //metodo que permite calcular una ruta
  private calcularRuta(){
    this.direcionService.route({
      origin: this.origen,
      destination:this.destino,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: this.WayPoints,
      optimizeWaypoints: true
    },(response, status)=>{
      if (status== google.maps.DirectionsStatus.OK) {
        this.direccionDibuja.setDirections(response);
      }else{
        console.log("Error al cargar la ruta " + status );
      }
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
  // Lista de puntos sobre paradas en mi ruta
  WayPoints: WayPoint[]=[
    {
      location:{ 
        lat:-33.58140964057867, lng:-70.59751299134992
      },stopover:true
    },
    {
      location:{ 
        lat:-33.58006482405834, lng:-70.58731108736964
      },stopover:true
    }
  ]

  listaMarcadores: MarcadorI[] = [{
    position: {
      lat: -33.59804332761758,
      lng: -70.5751251937849
    },
    title: 'Colegio San Carlos'
  },
  {
    position: {
      lat: -33.5751695,
      lng: -70.60354650000001
    },
    title: 'Casita'
  }
  ];
  //metodo que busca la direccion
  private Direccion(){
    console.log(this.dire);
    this.api.getDireccion(this.dire).subscribe(
      (data)=>{
        console.log(data);
      },
      (e)=>{
        console.log(e);
      }
    )
  }
}
