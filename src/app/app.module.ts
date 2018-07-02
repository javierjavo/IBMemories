import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CalendaryPageComponent } from './calendary-page/calendary-page.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';

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
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule, LayoutModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
