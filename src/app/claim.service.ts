import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { claim } from './claim';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ClaimService {

  // URL to web api
  //private claimsUrl = 'http://5cf16e72259b9500143d581a.mockapi.io/Products';//'api/claims';  
  private claimsUrl = 'http://10.123.52.131/api/api/ProductTeste';//'api/claims';  

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET claims from the server */
  getClaims (): Observable<claim[]> {
    return this.http.get<claim[]>(this.claimsUrl)
      .pipe(
        tap(_ => this.log('fetched claims')),
        catchError(this.handleError<claim[]>('getClaims', []))
      );
  }

  /** GET claim by id. Return `undefined` when id not found */
  getClaimNo404<Data>(id: number): Observable<claim> {
    //const url = `${this.claimsUrl}/?id=${id}`;
    const url = `${this.claimsUrl}/${id}`;
    return this.http.get<claim[]>(url)
      .pipe(
        map(claims => claims[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} claim id=${id}`);
        }),
        catchError(this.handleError<claim>(`getClaim id=${id}`))
      );
  }

  /** GET claim by id. Will 404 if id not found */
  getClaim(id: number): Observable<claim> {
    const url = `${this.claimsUrl}/${id}`;
    return this.http.get<claim>(url).pipe(
      tap(_ => this.log(`fetched claim id=${id}`)),
      catchError(this.handleError<claim>(`getClaim id=${id}`))
    );
  }

  /* GET claims whose name contains search term */
  searchClaims(term: string): Observable<claim[]> {
    if (!term.trim()) {
      // if not search term, return empty claim array.
      return of([]);
    }
    return this.http.get<claim[]>(`${this.claimsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found claims matching "${term}"`)),
      catchError(this.handleError<claim[]>('searchClaims', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new claim to the server */
  addClaim (claim: claim): Observable<claim> {
    return this.http.post<claim>(this.claimsUrl, claim, httpOptions).pipe(
      tap((newClaim: claim) => this.log(`added claim w/ id=${newClaim.id}`)),
      catchError(this.handleError<claim>('addClaim'))
    );
  }
  // addClaim (claim: claim): Observable<claim> {
  //   let objReturn:claim;
  //   return this.http.post<claim>(this.claimsUrl, claim, httpOptions).pipe(
  //     tap((objReturn) => this.log(`added claim w/`)),
  //     catchError(this.handleError<claim>('addClaim'))
  //   );
  // }

  /** DELETE: delete the claim from the server */
  deleteClaim (claim: claim | number): Observable<claim> {
    const id = typeof claim === 'number' ? claim : claim.id;
    const url = `${this.claimsUrl}/${id}`;

    return this.http.delete<claim>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted claim id=${id}`)),
      catchError(this.handleError<claim>('deleteClaim'))
    );
  }

  /** PUT: update the claim on the server */
  updateClaim (claim: claim): Observable<any> {
    const id = typeof claim === 'number' ? claim : claim.id;
    const url = `${this.claimsUrl}/${id}`;
    //return this.http.put(this.claimsUrl, claim, httpOptions).pipe(
    return this.http.put(url, claim, httpOptions).pipe(
      tap(_ => this.log(`updated claim id=${claim.id}`)),
      catchError(this.handleError<any>('updateClaim'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ClaimService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ClaimService: ${message}`);
  }
}
