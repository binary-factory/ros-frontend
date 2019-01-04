import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosCommonTableComponent } from './ros-common-table.component';

describe('RosCommonTableComponent', () => {
  let component: RosCommonTableComponent;
  let fixture: ComponentFixture<RosCommonTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosCommonTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosCommonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
