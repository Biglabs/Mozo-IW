import { BaseEntity } from './../../shared';

export const enum CoinType {
    'BTC',
    'ETH',
    'MOZO',
    'SOLO'
}

export const enum Network {
    'BTC_MAIN',
    'BTC_TEST',
    'ETH_MAIN',
    'ETH_TEST'
}

export class AddressSolo implements BaseEntity {
    constructor(
        public id?: number,
        public coin?: CoinType,
        public network?: Network,
        public address?: string,
        public derivedIndex?: number,
    ) {
    }
}
