import type { Customer } from '../types/customer';

export type SortDirection = 'asc' | 'desc';
export type SortField =
  | 'customerCode'
  | 'customerName'
  | 'customerInn'
  | 'customerKpp'
  | 'isOrganization'
  | 'isPerson'
  | 'customerLegalAddress'
  | 'customerPostalAddress'
  | 'customerEmail'
  | 'customerCodeMain';

export interface GetCustomersParams {
  customerCode?: string;
  name?: string;
  inn?: string;
  isOrganization?: boolean;
  isPerson?: boolean;
  page?: number;
  size?: number;
  sort?: `${SortField},${SortDirection}`;
  customerLegalAddress?: string;
  customerPostalAddress?: string;
  customerEmail?: string;
  customerCodeMain?: string;
}

interface Pageable {
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface GetCustomersResponse {
  content: Customer[];
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

export async function getCustomers(
  params: GetCustomersParams = {}
): Promise<GetCustomersResponse> {
  const query = new URLSearchParams();

  if (params.customerCode) query.append('customerCode', params.customerCode);
  if (params.name) query.append('name', params.name);
  if (params.inn) query.append('inn', params.inn);
  if (typeof params.isOrganization === 'boolean')
    query.append('isOrganization', String(params.isOrganization));
  if (typeof params.isPerson === 'boolean')
    query.append('isPerson', String(params.isPerson));
  if (typeof params.page === 'number') query.append('page', String(params.page));
  if (typeof params.size === 'number') query.append('size', String(params.size));
  if (params.sort) query.append('sort', params.sort);
  if (params.customerLegalAddress) query.append('customerLegalAddress', params.customerLegalAddress);
  if (params.customerPostalAddress) query.append('customerPostalAddress', params.customerPostalAddress);
  if (params.customerEmail) query.append('customerEmail', params.customerEmail);
  if (params.customerCodeMain) query.append('customerCodeMain', params.customerCodeMain);

  const response = await fetch(`http://localhost:8080/api/customers?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.statusText}`);
  }

  return await response.json() as GetCustomersResponse;
}


export interface CreateCustomerRequest {
  customerCode: string;
  customerName: string;
  customerInn?: string;
  customerKpp?: string;
  customerLegalAddress?: string;
  customerPostalAddress?: string;
  customerEmail?: string;
  customerCodeMain?: string;
  isOrganization: boolean;
  isPerson: boolean;
}

export async function createCustomer(
  customerData: CreateCustomerRequest
): Promise<Customer> {
  const response = await fetch('http://localhost:8080/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to create customer: ${response.status} ${response.statusText}` +
      (errorData.message ? ` - ${errorData.message}` : '')
    );
  }

  return await response.json() as Customer;
}

export interface UpdateCustomerRequest {
  customerCode: string;
  customerName: string;
  customerInn?: string;
  customerKpp?: string;
  customerLegalAddress?: string;
  customerPostalAddress?: string;
  customerEmail?: string;
  customerCodeMain?: string;
  isOrganization: boolean;
  isPerson: boolean;
}

export async function updateCustomer(
  customerCode: string,
  customerData: UpdateCustomerRequest
): Promise<Customer> {
  const response = await fetch(`http://localhost:8080/api/customers/${customerCode}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to update customer: ${response.status} ${response.statusText}` +
      (errorData.message ? ` - ${errorData.message}` : '')
    );
  }

  return await response.json() as Customer;
}

export async function deleteCustomer(customerCode: string): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/customers/${customerCode}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to delete customer: ${response.status} ${response.statusText}` +
      (errorData.message ? ` - ${errorData.message}` : '')
    );
  }

  return;
}