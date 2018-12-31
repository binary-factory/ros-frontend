import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosNodeInspectPageComponent } from './ros-node-inspect-page.component';

describe('RosNodeInspectPageComponent', () => {
  let component: RosNodeInspectPageComponent;
  let fixture: ComponentFixture<RosNodeInspectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosNodeInspectPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosNodeInspectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
