import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { claim }         from '../../claim';
import { ClaimService }  from '../../claim.service';

@Component({
  selector: 'app-claim-detail',
  templateUrl: './claim-detail.component.html',
  styleUrls: [ './claim-detail.component.css' ]
})
export class ClaimDetailComponent implements OnInit {
  @Input() claim: claim;

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getClaim();
  }

  getClaim(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.claimService.getClaim(id)
      .subscribe(claim => this.claim = claim);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.claimService.updateClaim(this.claim)
      .subscribe(() => this.goBack());
  }
}
