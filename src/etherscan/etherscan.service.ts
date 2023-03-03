import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { isTimestampOlderThan } from 'src/utils/etherscan.utils';

import { ApiBaseEndpoint } from '../constants/etherscan.constants';
import { WalletEntity } from '../wallet/wallet.entity';
import {
  ExchangeRate,
  EtherscanResponse,
  Transaction,
  WalletBalance,
} from './etherscan.interface';

@Injectable()
export class EtherscanService {
  currentExchangeRate: ExchangeRate;

  async getExchangeRate(): Promise<ExchangeRate | Error> {
    if (
      this.currentExchangeRate &&
      isTimestampOlderThan(this.currentExchangeRate.ethusd_timestamp, 600)
    )
      return this.currentExchangeRate;
    return axios
      .get(ApiBaseEndpoint, {
        params: {
          module: 'stats',
          action: 'ethprice',
          apikey: process.env.ETHERSCAN_API_KEY, // environment variable
        },
      })
      .then(
        (res: AxiosResponse<EtherscanResponse<ExchangeRate>>) =>
          res.data.result,
      )
      .catch((err: Error) => {
        console.log(err);
        throw err;
      });
  }

  setCustomExchangeRate(exchangeRate: ExchangeRate | null) {
    if (exchangeRate === null) this.getExchangeRate();
    this.currentExchangeRate = exchangeRate;
    return exchangeRate;
  }

  async getLastTransaction(address: string): Promise<Transaction | Error> {
    return axios
      .get(ApiBaseEndpoint, {
        params: {
          module: 'account',
          action: 'txlist',
          startblock: 'latest',
          endblock: 'latest',
          page: 1,
          offset: 1,
          sort: 'desc',
          apikey: process.env.ETHERSCAN_API_KEY,
          address,
        },
      })
      .then((res: AxiosResponse<EtherscanResponse<Transaction[]>>) =>
        res.data.result.pop(),
      )
      .catch((err: Error) => {
        console.log(err);
        throw err;
      });
  }

  async getAccountsBalances(
    wallets: string[],
  ): Promise<{ account: string; balance: number | string }[] | Error> {
    return axios
      .get(ApiBaseEndpoint, {
        params: {
          module: 'account',
          action: 'balancemulti',
          address: wallets.join(','),
          tag: 'latest',
          apikey: process.env.ETHERSCAN_API_KEY,
        },
      })
      .then((res: AxiosResponse<EtherscanResponse<WalletBalance[]>>) => {
        return res.data.result.map((account) => {
          const balance = parseInt(account.balance as string);
          return { ...account, balance: balance / 1e18 }; // wei to ether
        });
      })
      .catch((err: Error) => {
        console.log(err);
        throw err;
      });
  }
}
