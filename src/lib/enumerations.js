// lib/constants/enumerations.ts

export const WorkflowStatus = Object.freeze({
  Active: 1,
  Closed: 3,
});

export const BillStatus = Object.freeze({
  Created: 1,
  PendingBill: 2,
  Expired: 3,
  PandingApprovePayment: 4,
  Paid: 5,
});

export const CertificateStatus = Object.freeze({
  Created: 1,
  Failed: 2,
  Expired: 3,
});

export const TaskStatus = Object.freeze({
  PendingPayment: 17,
});

export const Languages = Object.freeze({
  Arabic: 1,
  English: 2,
});

export const SaveMode = Object.freeze({
  New: 1,
  Saved: 2,
});

export const FormMode = Object.freeze({
  Add: 1,
  Edit: 2,
  View: 3,
  EditDoument: 4,
  Resubmit: 5,
  Registeration: 6,
  Inquiry: 7,
  OriginalMail: 8,
  EditProfile: 9,
  ExtendAccount: 10,
  RenewAccount: 11,
  Summary: 12,
});

export const DocumentTypeBase = Object.freeze({
  Register: 3,
});
