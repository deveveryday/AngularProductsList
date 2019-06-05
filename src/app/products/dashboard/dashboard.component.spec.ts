import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ClaimSearchComponent } from '../claim-search/claim-search.component';

import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { claims } from '../../mock-claims';
import { ClaimService } from '../../claim.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let claimService;
  let getClaimsSpy;

  beforeEach(async(() => {
    claimService = jasmine.createSpyObj('ClaimService', ['getClaims']);
    getClaimsSpy = claimService.getClaims.and.returnValue( of(claims) );
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        ClaimSearchComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ClaimService, useValue: claimService }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top claims" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Top claims');
  });

  it('should call claimService', async(() => {
    expect(getClaimsSpy.calls.any()).toBe(true);
    }));

  it('should display 4 links', async(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
  }));

});
