import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EtherscanService } from './etherscan.service';
import { Transaction, ExchangeRate } from './etherscan.interface';
import { WalletEntity } from 'src/wallet/wallet.entity';

@Controller('eth')
export class EtherscanController {
  constructor(private readonly etherscanService: EtherscanService) {}

  @Get('exchange-rate')
  async getExchangeRate(): Promise<ExchangeRate | Error> {
    return this.etherscanService.getExchangeRate();
  }

  @Post('exchange-rate')
  async setExchangeRate(
    @Body() exchangeRate: ExchangeRate,
  ): Promise<ExchangeRate | Error> {
    return this.etherscanService.setCustomExchangeRate(exchangeRate);
  }

  @Delete('exchange-rate')
  async clearExchangeRate(): Promise<ExchangeRate | Error> {
    return this.etherscanService.setCustomExchangeRate(null);
  }

  @Get('last-transaction/:address')
  async getLastTransaction(
    @Param('address') address: string,
  ): Promise<Transaction | Error> {
    return this.etherscanService.getLastTransaction(address);
  }

  @Get('balance')
  async getAccountsBalances(@Body() wallets: string[]) {
    return this.etherscanService.getAccountsBalances(wallets);
  }
}
