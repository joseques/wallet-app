import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

import { WalletEntity } from './wallet.entity';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: InMemoryDBService<WalletEntity>,
  ) {}

  @Get()
  getAll() {
    return this.walletService.getAll();
  }

  @Post('add')
  add(@Body() wallet: WalletEntity) {
    return this.walletService.create(wallet);
  }

  @Post('favorite')
  setFavorite(@Body() wallet: WalletEntity) {
    const foundWallet = this.walletService.get(wallet.id);
    if (foundWallet) {
      foundWallet.favorite = wallet.favorite;
      this.walletService.update(foundWallet);
      return foundWallet;
    } else {
      throw new NotFoundException('Wallet not found');
    }
  }
}
