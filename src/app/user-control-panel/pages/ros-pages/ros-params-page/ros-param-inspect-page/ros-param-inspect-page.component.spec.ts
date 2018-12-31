import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosParamInspectPageComponent } from './ros-param-inspect-page.component';

describe('RosParamInspectPageComponent', () => {
  let component: RosParamInspectPageComponent;
  let fixture: ComponentFixture<RosParamInspectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosParamInspectPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosParamInspectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
