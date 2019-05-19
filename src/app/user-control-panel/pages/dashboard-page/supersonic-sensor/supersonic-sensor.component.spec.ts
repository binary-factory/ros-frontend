import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupersonicSensorComponent } from './supersonic-sensor.component';

describe('SupersonicSensorComponent', () => {
  let component: SupersonicSensorComponent;
  let fixture: ComponentFixture<SupersonicSensorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupersonicSensorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupersonicSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
