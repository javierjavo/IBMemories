import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, throwMatDuplicatedDrawerError } from '@angular/material';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  sSquad = '';
  name = '';
  lastname = '';
  share = true;
  IBM_date;
  birthday;
  myControl = new FormControl();
  squads = [
    {name:'One',tribu:"one"},{name:'Two',tribu:"Two"}, {name:'Three',tribu:"Three"}
  ]; //colect from db2 by python with http request
  filteredOptions: Observable<any[]>;

  constructor(private cookie: CookieService, public snackBar: MatSnackBar, private http: HttpClient) { 
  }
  
  ngOnInit() {
    let params = {
      type:'getAll',
      mail: this.cookie.get('login')
    }
    this.http.post('http://localhost:3000/q',params)
    .subscribe(
      res => {
        if (res['error'] == "none"){
          this.sSquad = res['squad'];
          this.name = res['name'];
          this.lastname = res['lName'];
          this.birthday = res['birthday'];
          this.IBM_date = res['anniversary'];
          this.share = res['share'];
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
    return this.squads.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  
  messaje(){
    let params = {
      type: 'update',
      squad: this.sSquad,
      name: this.name,
      lName: this.lastname,
      birthday: this.birthday,
      anniversary: this.IBM_date,
      share: this.share,
      mail: this.cookie.get('login')
    }
    this.http.post('http://localhost:3000/q',params)
    .subscribe(
      res => {
        if (res['error'] == "none"){
          this.snackBar.open(res['status'], 'ok' , {
            duration: 1500,
          });
        }
        else
          this.snackBar.open(res['error'], "ok" , {
            duration: 1000,
          });
      });
  }
}
