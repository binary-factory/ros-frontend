import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TprVideoPageComponent } from './tpr-video-page.component';

describe('TprVideoPageComponent', () => {
  let component: TprVideoPageComponent;
  let fixture: ComponentFixture<TprVideoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TprVideoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TprVideoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
