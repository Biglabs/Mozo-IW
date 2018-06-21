import { BaseEntity } from './../../shared';

export class WalletSolo implements BaseEntity {
    constructor(
        public id?: number,
        public walletKey?: string,
        public walletId?: string,
        public name?: string,
        public addresses?: BaseEntity[],
    ) {
    }
}
