export function buildAddressString(formValue: {
  street?: string;
  houseNo?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}): string {
  return `${formValue.street} ${formValue.houseNo}, ${formValue.zipCode} ${formValue.city}, ${formValue.country}`;
}
