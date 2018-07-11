import { Component, OnInit, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, throwMatDuplicatedDrawerError } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


export interface target {
  id:number,
  list:any,
  name:string,
  type:string,
  date:any,
  custom:string
};

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
  selected:target;
  evnts:[target];
  date;

  constructor(private cookie: CookieService, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
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
    this.filter('');
  }

  filter(value: string) {
    if (value.indexOf(',') !== -1){
      this.eventList.push(value);
      this.eventListView = "";
      value = "";
      console.log(this.eventList);
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