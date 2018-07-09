import { Component, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, throwMatDuplicatedDrawerError } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
  title = 'app';
  user="";
  passwd="";

  constructor(private cookie: CookieService, public snackBar: MatSnackBar, private http: HttpClient){ }

  login(){
    var params = {
      type:'login',
      user: this.user, 
      pass: this.passwd
    }

    this.http.post('http://localhost:3000/q',params)
    .subscribe(
      res => {
        if (res['data'] == "pass"){
          this.cookie.set("login",this.user);
          this.snackBar.open("Welcome", params['user'] , {
            duration: 2000,
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
}
