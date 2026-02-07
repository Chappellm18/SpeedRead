import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedSelectorComponent } from './speed-selector.component';

describe('SpeedSelectorComponent', () => {
  let component: SpeedSelectorComponent;
  let fixture: ComponentFixture<SpeedSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
