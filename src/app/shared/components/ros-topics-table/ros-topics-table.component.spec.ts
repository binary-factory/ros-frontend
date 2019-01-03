import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosTopicsTableComponent } from './ros-topics-table.component';

describe('RosTopicsTableComponent', () => {
  let component: RosTopicsTableComponent;
  let fixture: ComponentFixture<RosTopicsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosTopicsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosTopicsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
