import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosPointCloudComponent } from './ros-point-cloud.component';

describe('RosPointCloudComponent', () => {
  let component: RosPointCloudComponent;
  let fixture: ComponentFixture<RosPointCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosPointCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosPointCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
