import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosParamsPageComponent } from './ros-params-page.component';

describe('RosParamsPageComponent', () => {
  let component: RosParamsPageComponent;
  let fixture: ComponentFixture<RosParamsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosParamsPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosParamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
