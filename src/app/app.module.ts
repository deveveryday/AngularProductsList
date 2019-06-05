import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './master/app.component';
import { DashboardComponent }   from './products/dashboard/dashboard.component';
import { ClaimDetailComponent }  from './products/claim-detail/claim-detail.component';
import { ClaimsComponent }      from './products/claims/claims.component';
import { ClaimSearchComponent }  from './products/claim-search/claim-search.component';
import { MessagesComponent }    from './messages/messages.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CategoriesComponent } from './categories/categories.component';
import { BillingComponent } from './billing/billing.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // )
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    ClaimsComponent,
    ClaimDetailComponent,
    MessagesComponent,
    ClaimSearchComponent,
    CategoriesComponent,
    BillingComponent,
    HeaderComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
