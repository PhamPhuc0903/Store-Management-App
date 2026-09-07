export interface BootstrapOwnerStoreRequest {
  operationId: string;
  organizationName: string;
  storeName: string;
}

export interface BootstrapOwnerStoreResponse {
  organization: {
    id: string;
    name: string;
    version: number;
  };
  store: {
    id: string;
    organizationId: string;
    name: string;
    version: number;
  };
  membership: {
    id: string;
    organizationId: string;
    storeId: string;
    userId: string;
    role: 'OWNER';
    status: 'ACTIVE';
    version: number;
  };
}
