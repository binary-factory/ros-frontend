import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosTopicInspectPageComponent } from './ros-topic-inspect-page.component';

describe('RosTopicInspectPageComponent', () => {
  let component: RosTopicInspectPageComponent;
  let fixture: ComponentFixture<RosTopicInspectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosTopicInspectPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosTopicInspectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
