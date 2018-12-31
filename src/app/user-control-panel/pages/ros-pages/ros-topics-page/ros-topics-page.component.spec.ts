import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosTopicsPageComponent } from './ros-topics-page.component';

describe('RosTopicsPageComponent', () => {
  let component: RosTopicsPageComponent;
  let fixture: ComponentFixture<RosTopicsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RosTopicsPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosTopicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
