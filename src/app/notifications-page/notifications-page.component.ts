import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit {
  editando:boolean = false;
  selected = {
    id:0,
    url:"",
    name:"",
    type:"",
    date:"",
  };

  evnts = [{
    id:1,
    url:"https://picsum.photos/180/80?image=0",
    name:"name",
    type:"Birthday",
    date:"Date",
  },{
    id:2,
    url:"https://picsum.photos/180/80?image=1",
    name:"name",
    type:"Birthday",
    date:"Date",
  },{
    id:3,
    url:"https://picsum.photos/180/80?image=2",
    name:"name",
    type:"Birthday",
    date:"Date",
  },{
    id:4,
    url:"https://picsum.photos/180/80?image=3",
    name:"name",
    type:"Birthday",
    date:"Date",
  }];

  constructor() {
  }

  ngOnInit() {
  }

  goToPlan(selected){
    this.selected = selected;
    this.editando = true;
  }

  addEvent(){
    let newEvent = {
      id:5,
      url:"https://picsum.photos/180/80?image=4",
      name:"name",
      type:"Birthday",
      date:"Date",
    };
    this.evnts.push(newEvent);
  }

}
