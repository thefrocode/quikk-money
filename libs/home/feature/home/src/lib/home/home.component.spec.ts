import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionsStore, WalletStore } from '@quikk-money/app-store';
import { AuthStore, CustomerStore } from '@quikk-money/auth-store';

import {
  AuthService,
  CustomerApiService,
  TransactionApiService,
  WalletApiService,
} from '@quikk-money/quikk-api';
import { TopUpDialogComponent } from '@quikk-money/top-up-dialog';
import exp = require('constants');
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;
  let authStore: AuthStore;
  let customerStore: CustomerStore;
  let user: any;
  let loadedCustomer: any;
  let customer: any;
  let walletStore: WalletStore;
  let loadedWallet: any;
  let wallet: any;
  let walletService: WalletApiService;

  let transactionsStore: TransactionsStore;
  let transactions: any;

  let dialog: MatDialog;
  let dialogRefMock: jest.Mocked<MatDialogRef<any, any>>;

  beforeEach(async () => {
    dialogRefMock = {
      afterClosed: jest.fn(() => of({})),
      close: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signOut: jest.fn(),
          },
        },
        {
          provide: CustomerApiService,
          useValue: {},
        },
        {
          provide: WalletApiService,
          useValue: {
            update: jest.fn(),
            getWallet: jest.fn(),
          },
        },
        {
          provide: TransactionApiService,
          useValue: {},
        },
        {
          provide: ToastrService,
          useValue: {},
        },
        {
          provide: AuthStore,
          useValue: {
            user: jest.fn().mockReturnValue({
              emailVerified: false,
            }),
          },
        },
        {
          provide: CustomerStore,
          useValue: {
            loaded: jest.fn(),
            customer: jest.fn(),
          },
        },
        {
          provide: WalletStore,
          useValue: {
            loaded: jest.fn(),
            wallet: jest.fn(),
            getWallet: jest.fn(),
          },
        },
        {
          provide: TransactionsStore,
          useValue: {
            transactions: jest.fn(),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({ afterClosed: () => of({}) }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);

    authStore = TestBed.inject(AuthStore);

    customerStore = TestBed.inject(CustomerStore);

    walletStore = TestBed.inject(WalletStore);

    transactionsStore = TestBed.inject(TransactionsStore);

    user = authStore.user;

    loadedCustomer = customerStore.loaded;
    customer = customerStore.customer;

    walletService = TestBed.inject(WalletApiService);

    loadedWallet = walletStore.loaded;
    wallet = walletStore.wallet;

    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Auth Store', () => {
    it('should sign on sign out button clicked', fakeAsync(() => {
      const signOutButton =
        fixture.nativeElement.querySelector('.sign-out-button');
      signOutButton.click();
      tick();
      expect(authService.signOut).toHaveBeenCalled();
    }));

    it('should show email unverified warning if user is not verified', fakeAsync(() => {
      (authStore.user as unknown as jest.Mock).mockReturnValue({
        email: null,
        emailVerified: false,
        uid: null,
        displayName: null,
      });
      fixture.detectChanges();

      const unverified = fixture.nativeElement.querySelector('.unverified');

      expect(unverified).toBeTruthy();
    }));
    it('should not show email unverified warning if user is verified', fakeAsync(() => {
      (authStore.user as unknown as jest.Mock).mockReturnValue({
        email: 'test@gmail.com',
        emailVerified: true,
        uid: 'aa',
        displayName: 'test',
      });
      fixture.detectChanges();

      const unverified = fixture.nativeElement.querySelector('.unverified');

      expect(unverified).toBeFalsy();
    }));
  });

  describe('Customer Store', () => {
    it('should load customer name if customer is loaded', () => {
      (customerStore.loaded as unknown as jest.Mock).mockReturnValue(true);
      (customerStore.customer as unknown as jest.Mock).mockReturnValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      fixture.detectChanges();
      const customerName =
        fixture.nativeElement.querySelector('.customer-name');

      expect(customerName).toBeTruthy();
    });
    it('should not load customer name if customer is not loaded', () => {
      (customerStore.loaded as unknown as jest.Mock).mockReturnValue(false);
      (customerStore.customer as unknown as jest.Mock).mockReturnValue({});

      fixture.detectChanges();
      const customerName =
        fixture.nativeElement.querySelector('.customer-name');

      expect(customerName).toBeFalsy();
    });
  });
  describe('Wallet Store', () => {
    it('should display wallet balance if wallet is loaded', () => {
      (walletStore.loaded as unknown as jest.Mock).mockReturnValue(true);
      (walletStore.wallet as unknown as jest.Mock).mockReturnValue({
        balance: 100,
      });
      fixture.detectChanges();
      const walletBalance =
        fixture.nativeElement.querySelector('.wallet-balance');

      expect(walletBalance).toBeTruthy();
    });
    it('should not display wallet balance if wallet is not loaded', () => {
      (walletStore.loaded as unknown as jest.Mock).mockReturnValue(false);
      (walletStore.wallet as unknown as jest.Mock).mockReturnValue({
        balance: 100,
      });
      fixture.detectChanges();
      const walletBalance =
        fixture.nativeElement.querySelector('.wallet-balance');

      expect(walletBalance).toBeFalsy();
    });
  });

  describe('Transactions Store', () => {
    it('should display transactions if transactions are present', () => {
      const mockTransactions = [
        {
          timestamp: {
            seconds: 1627776000,
          },
          amount: 100,
        },
        {
          timestamp: {
            seconds: 1627776400,
          },
          amount: 200,
        },
      ] as any;
      (transactionsStore.transactions as unknown as jest.Mock).mockReturnValue(
        mockTransactions
      );

      fixture.detectChanges();
      const transactionsList =
        fixture.nativeElement.querySelectorAll('.transactions-list');

      expect(transactionsList.length).toEqual(mockTransactions.length);
    });
    it('should display empty transactions message if transactions are not present', () => {
      const mockTransactions = [] as any;
      (transactionsStore.transactions as unknown as jest.Mock).mockReturnValue(
        mockTransactions
      );

      fixture.detectChanges();
      const transactionsEmpty = fixture.nativeElement.querySelector(
        '.empty-transactions'
      );

      expect(transactionsEmpty).toBeTruthy();
    });
  });
});
