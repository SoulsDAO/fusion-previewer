import { Soul } from './Soul';

export interface FusionResult {
    probability: number;
    soul: Soul;
}

export interface Attribute {
    name: string;
    image: {
        default: string;
    }
    rarity?: Rarity;
}

export enum Rarity {
    None = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
}
