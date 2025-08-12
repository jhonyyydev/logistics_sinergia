import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportModalComponent } from './transport-modal.component';

describe('TransportModalComponent', () => {
  let component: TransportModalComponent;
  let fixture: ComponentFixture<TransportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
