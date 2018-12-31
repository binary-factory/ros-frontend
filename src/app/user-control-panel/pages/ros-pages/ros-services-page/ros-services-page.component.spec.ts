import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosServicesPageComponent } from './ros-services-page.component';

describe('RosServicesPageComponent', () => {
  let component: RosServicesPageComponent;
  let fixture: ComponentFixture<RosServicesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosServicesPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosServicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
