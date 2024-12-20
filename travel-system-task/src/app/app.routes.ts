import { Routes } from '@angular/router';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { SearchResultsComponent } from './components/search-result/search-result.component';

export const routes: Routes = [
  { path: '', redirectTo: '/default', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }, 
  {
    path: 'flight-details/:flightNumber',
    component: FlightDetailsComponent,
  },

  { path: 'filter-flights', component: SearchResultsComponent },
];
