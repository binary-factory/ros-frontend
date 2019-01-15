import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointCloudSettingsComponent } from './point-cloud-settings.component';

describe('PointCloudSettingsComponent', () => {
  let component: PointCloudSettingsComponent;
  let fixture: ComponentFixture<PointCloudSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointCloudSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointCloudSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
