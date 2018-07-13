import { Component, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, throwMatDuplicatedDrawerError } from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
  title = 'app';
  isLinear = true;
  firstFormGroup: FormGroup;
  registry = {
    user:"",
    pass:""
  };
  Registry = false;
  forgot = false;
  user="";
  passwd="";

  constructor(private cookie: CookieService, public snackBar: MatSnackBar, private http: HttpClient,private _formBuilder: FormBuilder){ }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.email]
    });
  }

  login(){
    var params = {
      type:'login',
      user: this.user, 
      passwd: this.passwd
    }
    this.http.post('http://localhost:3000/q',params)
    .subscribe(
      res => {
        if (res['data'] == "pass"){
          this.cookie.set("login",this.user);
          this.snackBar.open("Welcome", params['user'] , {
            duration: 2000,
          });
        }else{
          this.snackBar.open( res['error'], 'ok', {
            duration: 4000,
          });
        }
      }
    )
  }

  logged(){
    try{
      let aux = this.cookie.get("login");
      return aux;
    }catch{
      this.cookie.delete("login");
      return false;
    }
  }

  recoveryPasswd(){
    var params = {
      type:'recoveryPasswd',
      user: this.user
    }
    this.http.post('http://localhost:3000/q',params)
    .subscribe(
      res => {
        if (res['data'] == "pass"){
          this.cookie.set("login",this.user);
          this.snackBar.open("mail sended",'', {
            duration: 2000,
          });
        }else{
          this.snackBar.open( res['error'], 'ok', {
            duration: 4000,
          });
        }
      }
    )
  }
}
