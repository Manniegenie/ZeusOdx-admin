export interface FundUserRequest {
  email: string;
  amount: number;
  currency: string;
}

export interface FundUserResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    currency: string;
    amountFunded: number;
    newBalance: number;
    balances: {
      BTC: number;
      ETH: number;
      SOL: number;
      USDT: number;
      USDC: number;
      BNB: number;
      MATIC: number;
      TRX: number;
      NGNZ: number;
    };
  };
}