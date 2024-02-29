export const buildFullName = (...arr: (string | null | undefined)[]) =>
  arr
    .map((it) => it?.trim())
    .filter((it) => !!it)
    .join(' ');

export function getMainAndTechnicalContacts(formValue: {
  mainContactFirstName: string;
  mainContactLastName: string;
  mainContactEmail: string;
  mainContactPhoneNumber: string;
  technicalContactSameAsMain: boolean;
  technicalContactFirstName: string;
  technicalContactLastName: string;
  technicalContactEmail: string;
  technicalContactPhoneNumber: string;
}): {
  mainContactName: string;
  mainContactEmail: string;
  mainContactPhone: string;
  technicalContactName: string;
  technicalContactEmail: string;
  technicalContactPhone: string;
} {
  let mainContactName = buildFullName(
    formValue.mainContactFirstName,
    formValue.mainContactLastName,
  );
  let mainContactEmail = formValue.mainContactEmail || '';
  let mainContactPhone = formValue.mainContactPhoneNumber || '';

  let technicalContactName = formValue.technicalContactSameAsMain
    ? mainContactName
    : buildFullName(
        formValue.technicalContactFirstName,
        formValue.technicalContactLastName,
      );
  let technicalContactEmail = formValue.technicalContactSameAsMain
    ? mainContactEmail
    : formValue.technicalContactEmail || '';
  let technicalContactPhone = formValue.technicalContactSameAsMain
    ? mainContactPhone
    : formValue.technicalContactPhoneNumber || '';

  return {
    mainContactName,
    mainContactEmail,
    mainContactPhone,
    technicalContactName,
    technicalContactEmail,
    technicalContactPhone,
  };
}
