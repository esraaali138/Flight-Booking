import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search-for-flight/search-filter.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {  HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, CommonModule, HttpClientModule, TranslateModule],
  providers: [TranslateService],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'travel-system-task';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); 
  }

  toggleLanguage() {
    const currentLang = this.translate.currentLang;
    if (currentLang === 'en') {
      this.translate.use('ar');
    } else {
      this.translate.use('en');
    }
  }

  searchPerformed = false;
  onSearchInitiated() {
    this.searchPerformed = true;
  }
}

