import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P1HomeComponent } from './p1-home.component';

describe('P1HomeComponent', () => {
  let component: P1HomeComponent;
  let fixture: ComponentFixture<P1HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ P1HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(P1HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
