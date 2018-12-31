import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosServiceInspectPageComponent } from './ros-service-inspect-page.component';

describe('RosServiceInspectPageComponent', () => {
  let component: RosServiceInspectPageComponent;
  let fixture: ComponentFixture<RosServiceInspectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosServiceInspectPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosServiceInspectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
