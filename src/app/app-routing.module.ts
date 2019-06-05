import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './products/dashboard/dashboard.component';
import { ClaimsComponent }      from './products/claims/claims.component';
import { ClaimDetailComponent }  from './products/claim-detail/claim-detail.component';
import { CategoriesComponent }   from './categories/categories.component'
import { BillingComponent }      from './billing/billing.component'

const routes: Routes = [
  { path: '', redirectTo: 'products/dashboard', pathMatch: 'full' },
  { path: 'products/dashboard', component: DashboardComponent },
  { path: 'products/detail/:id', component: ClaimDetailComponent },
  { path: 'products', component: ClaimsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:id', component: CategoriesComponent },
  { path: 'billing', component: BillingComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
