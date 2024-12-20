import { Component } from '@angular/core';
import { FlightService } from '../../services/flight/flight.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FilterComponentComponent } from '../filter-component/filter-component.component';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule, RouterModule, FilterComponentComponent],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
})
export class SearchResultsComponent {
  searchData: any;
  flightData: any;
  filteredFlights: any[] = [];
  flightCards: any;

  source: string = '';
  destination: string = '';
  date: string = '';
  cabin: string = '';
  flightNumber!: string;
  noResultsMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const source = params['source'] || '';
      const destination = params['destination'] || '';
      const date = params['date'] || '';
      const cabin = params['cabin'] || '';

      this.source = source;
      this.destination = destination;
      this.date = date;
      this.cabin = cabin;

      this.flightService.getFlightData().subscribe((data) => {
        this.flightData = data;

        this.filteredFlights = this.flightData.airItineraries
          .map((itinerary: any) => {
            const filteredFlights = itinerary.allJourney.flights.flatMap(
              (flight: any) => {
                return flight.flightDTO.filter((flightDetail: any) => {
                  const matchesSource = source
                    ? flightDetail.departureTerminalAirport?.airportName
                        ?.toLowerCase()
                        .includes(source.toLowerCase())
                    : true;

                  const matchesDestination = destination
                    ? flightDetail.arrivalTerminalAirport?.airportName
                        ?.toLowerCase()
                        .includes(destination.toLowerCase())
                    : true;

                  const matchesCabin = cabin
                    ? flightDetail.flightInfo?.cabinClass
                        ?.toLowerCase()
                        .includes(cabin.toLowerCase())
                    : true;

                  return matchesSource && matchesDestination && matchesCabin;
                });
              }
            );

            if (filteredFlights.length > 0) {
              return {
                ...itinerary,
                allJourney: {
                  flights: filteredFlights,
                },
              };
            }

            return null;
          })
          .filter((itinerary: any) => itinerary !== null);

        this.flightCards = this.filteredFlights
          .map((itinerary: any) => {
            return itinerary.allJourney.flights.map((flight: any) => {
              return {
                airlineName:
                  flight?.flightAirline?.airlineName || 'Unknown Airline',
                airlineLogo:
                  flight?.flightAirline?.airlineLogo || 'default-logo',
                price: itinerary.itinTotalFare?.amount
                  ? itinerary.itinTotalFare.amount * 33
                  : 0,
                departureAirport:
                  flight?.departureTerminalAirport?.airportName ||
                  'Unknown Departure Airport',
                arrivalAirport:
                  flight?.arrivalTerminalAirport?.airportName ||
                  'Unknown Arrival Airport',
                departureDate: flight?.departureDate || 'Unknown Date',
                cabinClass: flight?.flightInfo?.cabinClass || 'Unknown Class',
                flightNumber:
                  flight?.flightInfo?.flightNumber || 'Unknown Flight',
              };
            });
          })
          .flat();
      });
    });
  }

  onFilterChange(filters: {
    minPrice: number;
    maxPrice: number;
    airlines: string[];
    airportName: string;
  }) {
    this.filteredFlights = this.flightCards.filter((card: any) => {
      const matchesPrice =
        card.price >= filters.minPrice && card.price <= filters.maxPrice;

      const matchesAirline = filters.airlines.includes(card.airlineName);

      const matchesAirport =
        card.departureAirport
          .toLowerCase()
          .includes(filters.airportName.toLowerCase()) ||
        card.arrivalAirport
          .toLowerCase()
          .includes(filters.airportName.toLowerCase());

      return matchesPrice && matchesAirline && matchesAirport;
    });

    if (this.filteredFlights.length === 0) {
      this.noResultsMessage =
        'Please apply all three filters: Price, Airline, and Airport to get results.';
    } else {
      this.noResultsMessage = '';
    }
  }
}
