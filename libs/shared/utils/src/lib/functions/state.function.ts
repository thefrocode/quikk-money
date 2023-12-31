import { Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * The possible status of an observable command
 */
export type Status = 'pending' | 'success' | 'error';

/**
 * A structure representing the state of an observable
 */
export type State<T> = {
  /** The value (initial or produced by the observable) */
  value: T;
  /** The error, if any, produced by the observable */
  error?: any;
  /** The status of the observable */
  status: Status;
};

/**
 * Converts an observable to a state signal
 * @param source$ The observable emitting the value
 * @param value The initial value
 * @returns A read-only signal with the state changes
 * @see State
 */
export function toState<T>(source$: Observable<T>, value: T): Signal<State<T>> {
  const state = signal<State<T>>({ value, status: 'pending' });
  const subscription = source$.subscribe({
    next: (value) => state.update((s) => ({ ...s, value, status: 'success' })),
    error: (error) => state.update((s) => ({ ...s, error, status: 'error' })),
  });
  return state.asReadonly();
}
