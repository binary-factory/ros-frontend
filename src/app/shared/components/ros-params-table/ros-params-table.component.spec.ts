import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosParamsTableComponent } from './ros-params-table.component';

describe('RosParamsTableComponent', () => {
  let component: RosParamsTableComponent;
  let fixture: ComponentFixture<RosParamsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosParamsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosParamsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
