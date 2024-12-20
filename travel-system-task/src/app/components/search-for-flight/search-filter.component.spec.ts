import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSearchComponentComponent } from './search-filter.component';

describe('LocationSearchComponentComponent', () => {
  let component: LocationSearchComponentComponent;
  let fixture: ComponentFixture<LocationSearchComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSearchComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSearchComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
