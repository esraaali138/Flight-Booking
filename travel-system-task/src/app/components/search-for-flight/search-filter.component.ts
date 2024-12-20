import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight/flight.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css'],
})
export class SearchComponent {
  @Output() searchInitiated = new EventEmitter<void>();
  flightForm!: FormGroup;
  submitted = false;
  flightData: any;
  filteredSourceFlights: any[] = [];
  filteredDestinationFlights: any[] = [];
  filteredCabinFlights: any[] = [];
  dropdownVisibleSource = false;
  dropdownVisibleDestination = false;
  dropdownVisibleCabin = false;
  selectedSource: any;
  selectedArrival: any;
  selectedCabinClass: any;
  searchPerformed = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private flightService: FlightService
  ) {}

  ngOnInit() {
    this.flightService.getFlightData().subscribe((data) => {
      this.flightData = data;
    });

    this.flightForm = this.fb.group({
      sourceAirport: ['', Validators.required],
      destinationAirport: ['', Validators.required],
      departureDate: ['', Validators.required],
      cabinClass: ['', Validators.required],
    });
  }

  onSourceSearchChange() {
    const sourceAirport =
      this.flightForm.get('sourceAirport')?.value?.toLowerCase() || '';

    if (sourceAirport.trim() === '') {
      this.filteredSourceFlights = [];
    } else {
      const uniqueSources = new Set<string>();
      this.flightData.airItineraries.forEach((flight: any) => {
        flight.allJourney.flights.forEach((journey: any) => {
          journey.flightDTO.forEach((flightDetail: any) => {
            const airportName =
              flightDetail.departureTerminalAirport.airportName?.toLowerCase();
            if (airportName?.includes(sourceAirport)) {
              uniqueSources.add(
                flightDetail.departureTerminalAirport.airportName
              );
            }
          });
        });
      });

      this.filteredSourceFlights = Array.from(uniqueSources);
    }
  }

  onDestinationSearchChange() {
    const destinationAirport =
      this.flightForm.get('destinationAirport')?.value?.toLowerCase() || '';

    if (destinationAirport.trim() === '') {
      this.filteredDestinationFlights = [];
    } else {
      const uniqueDestinations = new Set<string>();
      this.flightData.airItineraries.forEach((flight: any) => {
        flight.allJourney.flights.forEach((journey: any) => {
          journey.flightDTO.forEach((flightDetail: any) => {
            const airportName =
              flightDetail.arrivalTerminalAirport.airportName?.toLowerCase();
            if (airportName?.includes(destinationAirport)) {
              uniqueDestinations.add(
                flightDetail.arrivalTerminalAirport.airportName
              );
            }
          });
        });
      });

      this.filteredDestinationFlights = Array.from(uniqueDestinations);
    }
  }

  onCabinClassSearchChange() {
    const cabinClass =
      this.flightForm.get('cabinClass')?.value?.toLowerCase() || '';

    if (cabinClass.trim() === '') {
      this.filteredCabinFlights = [];
    } else {
      const uniqueCabinClasses = new Set<string>();
      this.filteredCabinFlights = this.flightData.airItineraries.filter(
        (flight: any) =>
          flight.allJourney.flights.some((journey: any) =>
            journey.flightDTO.some((flightDetail: any) => {
              const cabin = flightDetail.flightInfo.cabinClass?.toLowerCase();
              if (cabin?.includes(cabinClass)) {
                uniqueCabinClasses.add(cabin);
                return true;
              }
              return false;
            })
          )
      );
      this.filteredCabinFlights = Array.from(uniqueCabinClasses);
    }
  }

  toggleDropdown(field: string, visible: boolean) {
    if (field === 'source') {
      this.dropdownVisibleSource = visible;
    } else if (field === 'destination') {
      this.dropdownVisibleDestination = visible;
    } else if (field === 'cabin') {
      this.dropdownVisibleCabin = visible;
    }
  }

  setSource(source: string) {
    this.selectedSource = source;
    this.flightForm.get('sourceAirport')?.setValue(source);
    this.toggleDropdown('source', false);
  }

  setArrival(arrival: string) {
    this.selectedArrival = arrival;
    this.flightForm.get('destinationAirport')?.setValue(arrival);
    this.toggleDropdown('destination', false);
  }

  setCabinClass(cabinClass: string) {
    this.selectedCabinClass = cabinClass;
    this.flightForm.get('cabinClass')?.setValue(cabinClass);
    this.toggleDropdown('cabin', false);
  }

  onSearch() {
    this.submitted = true;
    this.flightForm.markAllAsTouched();
    if (this.flightForm.invalid) {
      return;
    }
    const searchParams = {
      source: this.flightForm.get('sourceAirport')?.value,
      destination: this.flightForm.get('destinationAirport')?.value,
      date: this.flightForm.get('departureDate')?.value,
      cabin: this.flightForm.get('cabinClass')?.value,
    };

    this.router.navigate(
      ['/filter-flights'],
      { queryParams: searchParams }
      // { state: { searchData } }
    );
    this.searchInitiated.emit();
  }
}
