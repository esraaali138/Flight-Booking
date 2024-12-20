import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search-for-flight/search-filter.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {  HttpClientModule } from '@angular/common/http';
import { LanguageService } from './services/language/language.service';

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
  currentLang! : string
  constructor(private langService: LanguageService, private translate: TranslateService) {
    this.translate.setDefaultLang(this.langService.language);
    this.translate.use(this.langService.language);
  }

  toggleLanguage() {
    this.currentLang = this.langService.language === 'en' ? 'ar' : 'en';
    this.langService.language = this.currentLang;
    this.translate.use(this.currentLang); 
  }

  searchPerformed = false;
  onSearchInitiated() {
    this.searchPerformed = true;
  }
}

