import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosViewerComponent } from './ros-viewer.component';

describe('RosViewerComponent', () => {
  let component: RosViewerComponent;
  let fixture: ComponentFixture<RosViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
