import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private cookie: CookieService){ }

  login(){
    this.cookie.set("login","1");
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
