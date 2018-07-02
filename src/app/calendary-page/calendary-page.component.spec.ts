import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendaryPageComponent } from './calendary-page.component';

describe('CalendaryPageComponent', () => {
  let component: CalendaryPageComponent;
  let fixture: ComponentFixture<CalendaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
