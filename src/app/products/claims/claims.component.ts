import { Component, OnInit } from '@angular/core';

import { claim } from '../../claim';
import { ClaimService } from '../../claim.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  claims: claim[];

  constructor(private claimService: ClaimService) { }

  ngOnInit() {
    this.getClaims();
  }

  getClaims(): void {
    this.claimService.getClaims()
    .subscribe(claims => this.claims = claims);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.claimService.addClaim({ name } as claim)
      .subscribe(claim => {
        this.claims.push(claim);
      });
  }
  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.claimService.addClaim({ name } as claim);
  // }

  delete(claim: claim): void {
    this.claims = this.claims.filter(h => h !== claim);
    this.claimService.deleteClaim(claim).subscribe();
  }

}
