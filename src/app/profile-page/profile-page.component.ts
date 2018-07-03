import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  name = '';
  lastname = '';
  IBM_date;
  birthday;
  myControl = new FormControl();
  squads = [{name:'One',tribu:"one"}, {name:'Two',tribu:"Two"}, {name:'Three',tribu:"Three"}]; //colect from db2 by python with http request
  filteredOptions: Observable<any[]>;

  constructor() { 
  }
  
  ngOnInit() {
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
    alert(this.IBM_date);
  }
}
