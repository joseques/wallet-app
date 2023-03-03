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
        console.error(err);
        throw err;
      });
  }

  setCustomExchangeRate(exchangeRate: ExchangeRate | null) {
    if (exchangeRate === null) this.getExchangeRate();
    this.currentExchangeRate = exchangeRate;
    return exchangeRate;
  }

  async getBulkLastTransaction(addresses: string[]) {
    const transactions: [string, Transaction | undefined][] = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          return [address, await this.getLastTransaction(address)];
        } catch (err) {
          console.error(err);
          throw err;
        }
      }),
    );

    return new Map<string, Transaction | undefined>(transactions);
  }

  async getLastTransaction(address: string) {
    try {
      const lastTX = await axios
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
        );
      return lastTX;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getAccountsBalances(wallets: string[]) {
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
        const balances = res.data.result.reduce((acc, account) => {
          let etherBalance = 0;

          if (account.balance && account.balance !== '0') {
            const balance = parseInt(account.balance as string);
            etherBalance = balance / 1e18; // convert wei to ether
          }

          acc.set(account.account, etherBalance);
          return acc;
        }, new Map<string, number>());
        return balances;
      })
      .catch((err: Error) => {
        console.error(err);
        throw err;
      });
  }
}
