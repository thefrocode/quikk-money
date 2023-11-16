import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMoneyDialogComponent } from './send-money-dialog.component';

describe('SendMoneyDialogComponent', () => {
  let component: SendMoneyDialogComponent;
  let fixture: ComponentFixture<SendMoneyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendMoneyDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendMoneyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
