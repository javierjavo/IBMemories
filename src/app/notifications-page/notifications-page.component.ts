import { Component, OnInit, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, throwMatDuplicatedDrawerError } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})

export class NotificationsPageComponent implements OnInit {
  type:any[];
  eventListView;
  eventList = [];
  eventType;
  customL:boolean = false;
  editando:boolean = false;
  selected;
  evnts=[];
  date;
  taComment = "";

  constructor(private cookie: CookieService, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
  }

  ngOnInit() {
    let params = {
      type:'events',
      mail: this.cookie.get('login')
    }
    this.http.post('http://localhost:3000/q',params)
    .subscribe( res => {
      if (res['error'] == "none"){
        let aux = new Date().toISOString().substring(0, 10);
        let t1 = new Date(aux).getTime();
        this.evnts = res['data'];
        this.evnts.forEach(x=>{
          let t2 = new Date(x.date.substring(0, 10)).getTime();
          x.date = -1*((t1-t2)/(1000*60*60*24));
        });
        this.evnts.sort((x,y)=> x.date > y.date?1:0 );
      }
      else
        this.snackBar.open(res['error'], 'ok' , {
          duration: 1000,
      });
    });
  }

  filter(value: string) {
    if (value.indexOf(',') !== -1){
      this.eventList.push(value);
      this.eventListView = "";
      value = "";
    }

    const filterValue = value.toLowerCase();
    let params = {
      type: this.customL ?'getPersonList':'getSquadList',
      filterValue
    }
    this.http.post('http://localhost:3000/q',params)
      .subscribe(
        res => {
          if (res['error'] == "none"){
            this.type = res['data'];
            return;
          }
          else
            this.snackBar.open(res['error'], 'ok' , {
            duration: 1000,});
        }
      );
  }

  updateInfo(){
    if(this.selected.messages) this.selected.messages.forEach(x=>{ 
      if (x.user == this.cookie.get('login')){
        x.message = this.taComment;
      } 
    });
    else {
      if (this.selected['messages'])
      this.selected['messages'].push({
        "user":this.cookie.get('login'),
        "message":this.taComment
      });
      else this.selected['messages']= [{
        "user":this.cookie.get('login'),
        "message":this.taComment
      }];
    }
    let params = {
      type: 'updateEvent',
      data: this.selected
    }
    this.http.post('http://localhost:3000/q',params)
      .subscribe(
        res => {
          if (res['error'] != "none"){
            this.snackBar.open(res['error'], 'ok' , {
              duration: 1000,});
            return false;
          } 
          return true;
        }
      );
  }

  goToPlan(selected){
    this.selected = selected;
    let d = new Date();
    this.selected.actual = new Date(d.setDate(d.getDate() + selected.date)).toDateString().substring(0, 16);
    if(selected.messages) selected.messages.forEach(x=>{ if (x.user == this.cookie.get('login'))  this.taComment = x.message });
    else this.taComment = "";
    this.editando = true;
  }

  addEvent(){
    let newEvent = {
      manager:'jis',
      list:'penguins',
      name:"name",
      type:"Birthday",
      date:"Date",
      custom:'yes'
    };
    this.evnts.push(newEvent);
  }

  openDialog(): void {
    let name = "titulo";
    let animal = "";
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '100%',
      data: {name: name, animal: animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      animal = result;
    });
  } 

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}