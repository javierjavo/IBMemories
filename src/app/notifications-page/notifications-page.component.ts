import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, throwMatDuplicatedDrawerError } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface target {
  id:number,
  list:any,
  name:string,
  type:string,
  date:any,
  custom:string
};

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})

export class NotificationsPageComponent implements OnInit {
  editando:boolean = false;
  selected:target;
  evnts:[target];
  date;
  type = [
    {name:'Birthday'},{name:'casual meeting'}, {name:'Farewell'}
  ];
  filteredOptions: Observable<any[]>;
  myControl = new FormControl();

  constructor(private cookie: CookieService, public snackBar: MatSnackBar, private http: HttpClient) {
  }

  ngOnInit() {
    let params = {
      type:'events',
      mail: this.cookie.get('login')
    }
    this.http.post('http://localhost:3000/q',params)
    .subscribe(
      res => {
        if (res['error'] == "none"){
          this.evnts = res['data'];
        }
        else
          this.snackBar.open(res['error'], 'ok' , {
            duration: 1000,
          });
      }
    )

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.type.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  goToPlan(selected){
    this.selected = selected;
    this.editando = true;
  }

  addEvent(){
    let newEvent = {
      id:5,
      list:'penguins',
      name:"name",
      type:"Birthday",
      date:"Date",
      custom:'none'
    };
    this.evnts.push(newEvent);
  }

}
