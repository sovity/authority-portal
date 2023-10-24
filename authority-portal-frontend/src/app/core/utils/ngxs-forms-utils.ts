export interface NgxsFormState<T> {
  model: T;
  dirty: boolean;
  status: string;
  errors: any;
}

export function initialFormState<T>(initialValue: T): NgxsFormState<T> {
  return {
    model: initialValue,
    dirty: false,
    status: '',
    errors: {},
  };
}
