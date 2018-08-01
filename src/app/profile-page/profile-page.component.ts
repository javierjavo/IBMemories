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
  panelOpenState = false;
  pswdold = '';
  pswdnew='';
  sSquad = '';
  name = '';
  lastname = '';
  config = true;
  IBM_date;
  birthday;
  myControl = new FormControl();
  squads = [
    {name:'penguins',tribu:"jis"},
    {name:'seals',tribu:"jis"},
    {name:'tequila',tribu:"jis"},
    {name:'saviors',tribu:"xsaviors"}
  ]; //colect from db2 by python with http request
  filteredOptions: Observable<any[]>;

  constructor(private cookie: CookieService, public snackBar: MatSnackBar, private http: HttpClient) {
  }
  
  ngOnInit() {
    let params = {
      type:'getProfile',
      mail: this.cookie.get('login')
    }
    this.http.post('http://localhost:3000/q',params)
    .subscribe(
      res => {
        if (res['error'] == "none"){
          this.squads = res['squadList'];
          this.sSquad = res['squad'];
          this.name = res['name'];
          this.lastname = res['Lname'];
          this.birthday = res['birthday'];
          this.IBM_date = res['anniversary'];
          this.config = res['config']=='true';
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

  getClass(i){
    if(i == "btn"){
      return (this.panelOpenState)? "btn-submit-translated" : "btn-submit" ;
    }
  }

  messaje(){
    let params = (this.panelOpenState)?{
      type: 'update',
      mail: this.cookie.get('login'),
      oldpass: this.pswdold,
      newpass: this.pswdnew
    }:{
      type: 'update',
      squad: this.sSquad,
      name: this.name,
      Lname: this.lastname,
      birthday: this.birthday,
      anniversary: this.IBM_date,
      config: this.config,
      mail: this.cookie.get('login')
    };
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
