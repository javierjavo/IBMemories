import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  constructor() {
  }
  
  ngOnInit() {
  }

  mensaje(){
    var request = require('request'); //bash: npm install request
    // URL for request POST /message
    var url = 'https://foo.chat-api.com/message?token=83763g87x';
    var data = {
        phone: '523332558987', // Receivers phone
        body: 'Hello, Andrew!', // Сообщение
    };
    // Send a request
    request({
        url: url,
        method: "POST",
        json: data
    });
  }
}
