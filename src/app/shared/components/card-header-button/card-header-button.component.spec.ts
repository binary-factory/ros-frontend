import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeaderButtonComponent } from './card-header-button.component';

describe('CardHeaderButtonComponent', () => {
  let component: CardHeaderButtonComponent;
  let fixture: ComponentFixture<CardHeaderButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardHeaderButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHeaderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
