export interface ISSLCommerz {
  amount: number;
  transactionId: string;
  email: string;
  name: string;
  phone: string;
  address: string;
}
export interface ISSLCommerzResponse {
  status: string;
  GatewayPageURL: string;
  failedreason?: string;
  sessionkey?: string;
}