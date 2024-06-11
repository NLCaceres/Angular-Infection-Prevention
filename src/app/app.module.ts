import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { FormsModule } from "@angular/forms"; // - Enables form modification of models
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"; // - Ng Boostrap
// !: Components for declarations
import { AppComponent } from "./app.component";
import { ReportsComponent } from "./reports/reports.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProfessionsComponent } from "./professions/professions.component";
import { ProfessionDetailComponent } from "./profession-detail/profession-detail.component";
import { MessagesComponent } from "./messages/messages.component";
import { AddProfessionComponent } from "./add-profession/add-profession.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

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
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [provideHttpClient(withFetch())]
})
export class AppModule {}
