export interface ExchangeRate {
  ethusd?: string;
  ethusd_timestamp?: string;
}

export interface Transaction {
  timeStamp: string;
}

export interface WalletBalance {
  account: string;
  balance: number | string;
}

export interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}
