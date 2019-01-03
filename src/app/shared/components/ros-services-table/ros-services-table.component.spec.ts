import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosServicesTableComponent } from './ros-services-table.component';

describe('RosServicesTableComponent', () => {
  let component: RosServicesTableComponent;
  let fixture: ComponentFixture<RosServicesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosServicesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosServicesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
