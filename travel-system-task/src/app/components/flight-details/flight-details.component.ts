import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flight/flight.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.css'],
})
export class FlightDetailsComponent {
  flightNumber!: string;
  flightData: any;
  filteredFlight: any;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
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






