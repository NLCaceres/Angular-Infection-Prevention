import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FormsModule } from "@angular/forms"; // Enables form modification of models

// Do the same for your future service that will handle routes
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReportsComponent } from "./reports/reports.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProfessionsComponent } from "./professions/professions.component";
import { ProfessionDetailComponent } from "./profession-detail/profession-detail.component";
import { MessagesComponent } from "./messages/messages.component";
import { AddProfessionComponent } from "./add-profession/add-profession.component";
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportsComponent,
    NavbarComponent,
    ProfessionsComponent,
    ProfessionDetailComponent,
    MessagesComponent,
    AddProfessionComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [], //? Using "providedIn" removes the need to use this array FOR NOW
  bootstrap: [AppComponent]
})
export class AppModule {}
