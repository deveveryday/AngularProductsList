import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { claim } from '../../claim';
import { ClaimService } from '../../claim.service';

@Component({
  selector: 'app-claim-search',
  templateUrl: './claim-search.component.html',
  styleUrls: [ './claim-search.component.css' ]
})
export class ClaimSearchComponent implements OnInit {
  claims$: Observable<claim[]>;
  private searchTerms = new Subject<string>();

  constructor(private claimService: ClaimService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.claims$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.claimService.searchClaims(term)),
    );
  }
}
