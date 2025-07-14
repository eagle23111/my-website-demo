export interface Lot {
  lotName: string;
  customerCode: string;
  price: number;
  currencyCode: string;
  ndsRate: string;
  placeDelivery: string;
  dateDelivery: string; // ISO-8601 datetime format
}