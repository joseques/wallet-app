import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { EtherscanService } from 'src/etherscan/etherscan.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [InMemoryDBModule.forRoot({})],
  controllers: [WalletController],
  providers: [EtherscanService],
})
export class WalletModule {}
