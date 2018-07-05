import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningCenterComponent } from './planning-center.component';

describe('PlanningCenterComponent', () => {
  let component: PlanningCenterComponent;
  let fixture: ComponentFixture<PlanningCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
