import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';

@Module({
  imports: [InMemoryDBModule.forRoot({})],
  controllers: [WalletController],
})
export class WalletModule {}
