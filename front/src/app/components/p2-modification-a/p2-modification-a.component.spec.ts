import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2ModificationAComponent } from './p2-modification-a.component';

describe('P2ModificationAComponent', () => {
  let component: P2ModificationAComponent;
  let fixture: ComponentFixture<P2ModificationAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ P2ModificationAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(P2ModificationAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
