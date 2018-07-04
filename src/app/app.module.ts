import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, 
MatFormFieldModule, MatInputModule, MatNativeDateModule, MatAutocompleteModule} from '@angular/material';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CalendaryPageComponent } from './calendary-page/calendary-page.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';
import { CookieService } from 'ngx-cookie-service';

const appRoutes:Routes = [
  { path:'profile-page', component:ProfilePageComponent }, //profile
  { path:'calendary-page', component:CalendaryPageComponent }, //calendary
  { path:'notifications-page', component:NotificationsPageComponent }  //notifications-links to planning
];

@NgModule({
  declarations: [
    AppComponent,
    MyNavComponent,
    ProfilePageComponent,
    CalendaryPageComponent,
    NotificationsPageComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes), BrowserModule, BrowserAnimationsModule, MatButtonModule, MatDatepickerModule,MatFormFieldModule,
    MatCheckboxModule, LayoutModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule,MatInputModule,FormsModule,
    MatNativeDateModule, MatAutocompleteModule, ReactiveFormsModule
  ],
  providers: [ CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
