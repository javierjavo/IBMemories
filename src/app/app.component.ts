import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  user="";
  passwd="";

  constructor(private cookie: CookieService, public snackBar: MatSnackBar){ }

  login(){
    this.cookie.set("login","1");
    this.snackBar.open("message", "action", {
      duration: 2000,
    });
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
