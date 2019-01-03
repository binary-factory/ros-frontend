import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosNodesTableComponent } from './ros-nodes-table.component';

describe('RosNodesTableComponent', () => {
  let component: RosNodesTableComponent;
  let fixture: ComponentFixture<RosNodesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosNodesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosNodesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
