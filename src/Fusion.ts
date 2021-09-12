import { Soul } from './Soul';
import { Attribute } from './Types';
import { shuffle } from './Utilities';

function getCombos(a: Attribute, b: Attribute) {
    /* Identical, can only be this */
    if (a.name === b.name) {
        return [a];
    }

    return [a, b];
}

export function fuseSouls(a?: Soul, b?: Soul): Soul[] {
    if (!a || !b) {
        return [];
    }

    const combinations = [];

    for (const background of getCombos(a.background, b.background)) {
        for (const body of getCombos(a.body, b.body)) {
            for (const eye of getCombos(a.eyes, b.eyes)) {
                for (const mouth of getCombos(a.mouth, b.mouth)) {
                    for (const cheek of getCombos(a.cheeks, b.cheeks)) {
                        for (const glass of getCombos(a.glasses, b.glasses)) {
                            for (const hair of getCombos(a.hair, b.hair)) {
                                for (const hand of getCombos(a.hands, b.hands)) {
                                    combinations.push(new Soul(
                                        background,
                                        body,
                                        eye,
                                        mouth,
                                        cheek,
                                        glass,
                                        hair,
                                        hand
                                    ));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return shuffle(combinations);
}
