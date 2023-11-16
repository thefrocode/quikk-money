import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopUpDialogComponent } from './top-up-dialog.component';

describe('TopUpDialogComponent', () => {
  let component: TopUpDialogComponent;
  let fixture: ComponentFixture<TopUpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopUpDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
