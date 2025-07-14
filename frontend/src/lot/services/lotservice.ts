import type { Lot } from '../types/lot';

export type LotSortDirection = 'asc' | 'desc';
export type LotSortField =
  | 'lotName'
  | 'customerCode'
  | 'price'
  | 'currencyCode'
  | 'dateDelivery'
  | 'placeDelivery'
  | 'ndsRate'

export interface GetLotsParams {
  lotName?: string;
  customerCode?: string;
  minPrice?: number;
  maxPrice?: number;
  currencyCode?: string;
  ndsRate?: string;
  placeDelivery?: string;
  page?: number;
  size?: number;
  sort?: `${LotSortField},${LotSortDirection}`;
}

interface Pageable {
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface GetLotsResponse {
  content: Lot[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  number: number;
  size: number;
  numberOfElements: number;
  empty: boolean;
}

export async function getLots(
  params: GetLotsParams = {}
): Promise<GetLotsResponse> {
  const query = new URLSearchParams();

  if (params.lotName) query.append('lotName', params.lotName);
  if (params.customerCode) query.append('customerCode', params.customerCode);
  if (typeof params.minPrice === 'number') query.append('minPrice', String(params.minPrice));
  if (typeof params.maxPrice === 'number') query.append('maxPrice', String(params.maxPrice));
  if (params.currencyCode) query.append('currencyCode', params.currencyCode);
  if (params.ndsRate) query.append('ndsRate', params.ndsRate);
  if (params.placeDelivery) query.append('placeDelivery', params.placeDelivery);
  if (typeof params.page === 'number') query.append('page', String(params.page));
  if (typeof params.size === 'number') query.append('size', String(params.size));
  if (params.sort) query.append('sort', params.sort);

  const response = await fetch(`http://localhost:8080/api/lots?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lots: ${response.statusText}`);
  }

  return await response.json() as GetLotsResponse;
}

export async function getLotByName(name: string): Promise<Lot> {
  const response = await fetch(`http://localhost:8080/api/lots/${encodeURIComponent(name)}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Lot not found: ${name}`);
    }
    throw new Error(`Failed to fetch lot: ${response.statusText}`);
  }

  return await response.json() as Lot;
}

export interface CreateLotRequest {
  lotName: string;
  customerCode: string;
  price: number;
  currencyCode: string;
  ndsRate: string;
  placeDelivery: string;
  dateDelivery: string; // ISO-8601
}

export async function createLot(
  lotData: CreateLotRequest
): Promise<Lot> {
  const response = await fetch('http://localhost:8080/api/lots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(lotData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to create lot: ${response.status} ${response.statusText}` +
      (errorData.message ? ` - ${errorData.message}` : '')
    );
  }

  return await response.json() as Lot;
}

export interface UpdateLotRequest {
  lotName: string;
  customerCode: string;
  price: number;
  currencyCode: string;
  ndsRate: string;
  placeDelivery: string;
  dateDelivery: string; // ISO-8601 
}

export async function updateLot(
  name: string,
  lotData: UpdateLotRequest
): Promise<Lot> {
  if (name !== lotData.lotName) {
    throw new Error('Lot name in path must match the name in the request body');
  }

  const response = await fetch(`http://localhost:8080/api/lots/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(lotData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Lot not found: ${name}`);
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to update lot: ${response.status} ${response.statusText}` +
      (errorData.message ? ` - ${errorData.message}` : '')
    );
  }

  return await response.json() as Lot;
}

export async function deleteLot(name: string): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/lots/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Lot not found: ${name}`);
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to delete lot: ${response.status} ${response.statusText}` +
      (errorData.message ? ` - ${errorData.message}` : '')
    );
  }

  return;
}