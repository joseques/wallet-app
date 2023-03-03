import { Module } from '@nestjs/common';
import { EtherscanModule } from './etherscan/etherscan.module';
import { WalletModule } from './wallet/wallet.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    EtherscanModule,
    WalletModule,
  ],
})
export class AppModule {}
