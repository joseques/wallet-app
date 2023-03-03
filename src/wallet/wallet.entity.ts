import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface WalletEntity extends InMemoryDBEntity {
  id: string;
  address: string;
  favorite?: boolean;
}
