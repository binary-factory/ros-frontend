import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosNodesPageComponent } from './ros-nodes-page.component';

describe('RosNodesPageComponent', () => {
  let component: RosNodesPageComponent;
  let fixture: ComponentFixture<RosNodesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosNodesPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosNodesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
