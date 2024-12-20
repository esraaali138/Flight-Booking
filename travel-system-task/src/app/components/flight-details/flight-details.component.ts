import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flight/flight.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.css'],
})
export class FlightDetailsComponent {
  flightNumber!: string;
  flightData: any;
  filteredFlight: any;
  currentLang: string = 'en';

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private langService: LanguageService

  ) {}

  ngOnInit(): void {
    this.langService.language$.subscribe((lang) => {
      this.currentLang = lang;
    });

    this.flightNumber = this.route.snapshot.paramMap.get('flightNumber') || '';
    this.fetchFlightData();
  }

  fetchFlightData(): void {
    this.flightService.getFlightData().subscribe((data: any) => {
      this.flightData = data;

      this.filteredFlight = data.airItineraries.find((itinerary: any) => {
        return itinerary.allJourney.flights.some((flight: any) => {
          return flight.flightDTO.some((segment: any) => {
            return segment.flightInfo.flightNumber === this.flightNumber;
          });
        });
      });
    });
  }
}






