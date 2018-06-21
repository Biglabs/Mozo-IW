import { BaseEntity } from './../../shared';

export class WalletAddressSolo implements BaseEntity {
    constructor(
        public id?: number,
        public inUse?: boolean,
        public address?: BaseEntity,
        public wallet?: BaseEntity,
    ) {
        this.inUse = false;
    }
}
