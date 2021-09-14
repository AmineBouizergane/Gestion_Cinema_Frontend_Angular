import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CinemaService} from "../service/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public currentVilles;
  public  currentCinema;
  public  salles;
  public currentProjection;
  public selectedTicket;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    // this.http.get("http://localhost:8082/villes")
    this.cinemaService.getVille()
        .subscribe(data=>{
            this.villes=data;
        },err=>{
            console.log(err);
        })
  }

  onGetCinemas(v){
    this.currentVilles=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas=data;
      },err=>{
        console.log(err);
      })
  }

  onGetSalles(c) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
        this.salles=data;
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projection=data;
            },err=>{
              console.log(err);
            })
        })
      },err=>{
        console.log(err);
      })
  }

  onGetTicketsPlaces(p) {
    this.currentProjection=p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.selectedTicket=[];
      },err=>{
        console.log(err);
      })
  }

  onSelectTickets(t) {
    if(!t.selected){
      t.selected=true;
      this.selectedTicket.push(t);
    }else{
      t.selected=false;
      this.selectedTicket.splice(this.selectedTicket.indexOf(t),1);
    }

    console.log(this.selectedTicket);

  }

  getTicketsClass(t) {
    let str="btn ticket";
    if(t.reserve==true){
      str+=" btn-danger";
    }else if(t.selected){
      str+=" btn-warning";
    }else{
      str+=" btn-success";
    }
    return str;
  }

  onPayTickets(form) {


  }
}
