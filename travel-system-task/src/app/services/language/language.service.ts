import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor() { }

  private currentLang = new BehaviorSubject<string>('en');

  language$ = this.currentLang.asObservable();

  get language(): string {
    return this.currentLang.value;
  }

  set language(lang: string) {
    this.currentLang.next(lang); 
  }
}
