import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'app-filter-component',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule],
  templateUrl: './filter-component.component.html',
  styleUrls: ['./filter-component.component.css'],
})
export class FilterComponentComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();

  airlines: string[] = [
    'Nile Air',
    'Qatar Airways (Q.C.S.C.)',
    'EgyptAir',
    'Royal Jordanian',
    'Gulf Air B.S.C. (c)',
    'Etihad Airways',
    'Kuwait Airways',
    'Saudia Arabia Airline',
    'Oman Air (S.A.O.C.)',
    'National Air Services / Flynas',
    'Ethiopian Airlines Enterprise',
    'Emirates',
    'Turkish Airlines Inc.',
  ];

  selectedAirlines: string[] = [];
  minPrice: number = 3000;
  maxPrice: number = 10000;
  airportName: string = '';
  hasArabicInput: boolean = false;
  currentLang: string = 'en';


  constructor(    private langService: LanguageService
  ){}

  ngOnInit(): void {
    this.langService.language$.subscribe((lang) => {
      this.currentLang = lang;
    });

  }
  onPriceChange() {
    this.emitFilters();
  }

  onAirlineChange(event: any, airline: string) {
    if (event.target.checked) {
      this.selectedAirlines.push(airline);
    } else {
      this.selectedAirlines = this.selectedAirlines.filter(
        (a) => a !== airline
      );
    }
    this.emitFilters();
  }

  onAirportChange(event: any) {

    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(event.target.value)) {
      event.target.value = event.target.value.replace(arabicRegex, '');
      this.hasArabicInput = true; 
    } else {
      this.hasArabicInput = false;
    }
    this.airportName = event.target.value;

    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit({
      airlines: this.selectedAirlines,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      airportName: this.airportName,
    });
  }
}
