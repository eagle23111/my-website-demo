export type Customer = {
  customerCode: string;
  customerName: string;
  customerInn: string;
  customerKpp: string;
  customerLegalAddress: string;
  customerPostalAddress: string;
  customerEmail: string;
  customerCodeMain: string | null;
  isOrganization: boolean;
  isPerson: boolean;
};
