import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P0LoginComponent } from './p0-login.component';

describe('P0LoginComponent', () => {
  let component: P0LoginComponent;
  let fixture: ComponentFixture<P0LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ P0LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(P0LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
