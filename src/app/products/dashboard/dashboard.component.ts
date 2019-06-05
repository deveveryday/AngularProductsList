import { Component, OnInit } from '@angular/core';
import { claim } from '../../claim';
import { ClaimService } from '../../claim.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  claims: claim[] = [];

  constructor(private claimService: ClaimService) { }

  ngOnInit() {
    this.getClaims();
  }

  getClaims(): void {
    this.claimService.getClaims()
      .subscribe(claims => this.claims = claims.slice(1, 5));
  }
}
