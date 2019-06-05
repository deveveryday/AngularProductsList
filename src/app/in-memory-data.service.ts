import { InMemoryDbService } from 'angular-in-memory-web-api';
import { claim } from './claim';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const claims = [
      { id: 11, name: 'Sinistro xyz' },
      { id: 12, name: 'Sinistro jndfk' },
      { id: 13, name: 'Sinistro 2000' },
      { id: 14, name: 'Sinistro sawq' },
      { id: 15, name: 'Sinitro 384t' },
      { id: 16, name: 'Sinistro 345' },
      { id: 17, name: 'Sinitro iggrei' },
      { id: 18, name: 'Sinitro ´diknrg' },
      { id: 19, name: 'Sinistro 9343k4n' },
      { id: 20, name: 'Sinistro 3435' }
    ];
    return {claims};
  }

  // Overrides the genId method to ensure that a claim always has an id.
  // If the claims array is empty,
  // the method below returns the initial number (11).
  // if the claims array is not empty, the method below returns the highest
  // claim id + 1.
  genId(claims: claim[]): number {
    return claims.length > 0 ? Math.max(...claims.map(claim => claim.id)) + 1 : 11;
  }
}
