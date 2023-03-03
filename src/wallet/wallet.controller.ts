import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

import { WalletEntity } from './wallet.entity';
import { EtherscanService } from '../etherscan/etherscan.service';
import { isTimestampOlderThan } from '../utils/etherscan.utils';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: InMemoryDBService<WalletEntity>,
    private readonly etherscanService: EtherscanService,
  ) {}

  @Get()
  async getAll() {
    try {
      const wallets = this.walletService.getAll();
      const addresses = wallets.map((wallet) => wallet.address);
      if (!wallets.length) return [];
      const balances = await this.etherscanService.getAccountsBalances(
        addresses,
      );
      const lastTransactions =
        await this.etherscanService.getBulkLastTransaction(addresses);

      const walletsWithBalance = wallets.map((wallet) => {
        const balance = balances.get(wallet.address) || 0;
        return {
          ...wallet,
          balance,
          isOld: lastTransactions.get(wallet.address)
            ? isTimestampOlderThan(
                lastTransactions.get(wallet.address).timeStamp,
                600,
              )
            : false,
        };
      });

      return walletsWithBalance;
    } catch (error) {
      throw new Error(`Error trying to get wallets: ${error.message}`);
    }
  }

  @Post('add')
  add(@Body() wallet: WalletEntity) {
    if (!wallet || !wallet.address)
      throw new BadRequestException('Wallet address cannot be empty');
    return this.walletService.create(wallet);
  }

  @Post('toggle-favorite')
  setFavorite(@Body() wallet: WalletEntity) {
    const foundWallet = this.walletService.get(wallet.id);
    if (foundWallet) {
      foundWallet.favorite = !foundWallet.favorite;
      this.walletService.update(foundWallet);
      return foundWallet;
    } else {
      throw new NotFoundException('Wallet not found');
    }
  }
}
