import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosNodeGraphComponent } from './ros-node-graph.component';

describe('RosNodeGraphComponent', () => {
  let component: RosNodeGraphComponent;
  let fixture: ComponentFixture<RosNodeGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosNodeGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosNodeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
