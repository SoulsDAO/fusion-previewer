import { Soul } from './Soul';
import { Attribute, FusionResult, Rarity } from './Types';

const bodyDistanceMap = new Map([
    ['White', 0],
    ['Green', 1],
    ['Blue', 2],
    ['Purple', 3],
    ['Orange', 4],
    ['Rainbow', 5],
]);

const attributeDistanceMap = new Map([
    [Rarity.None, 0],
    [Rarity.Common, 1],
    [Rarity.Uncommon, 2],
    [Rarity.Rare, 3],
]);

function getBodyProbability(a: Attribute, b: Attribute) {
    const aDistance = bodyDistanceMap.get(a.name)!;
    const bDistance = bodyDistanceMap.get(b.name)!;

    const distance = Math.abs(aDistance - bDistance);

    let probabilities = [0, 0];

    switch (distance) {
        case 0: {
            probabilities = [0.5, 0.5];
            break;
        }
        case 1: {
            probabilities = [0.9, 0.1];
            break;
        }
        case 2: {
            probabilities = [0.8, 0.2];
            break;
        }
        case 3: {
            probabilities = [0.7, 0.3];
            break;
        }
        case 4: {
            probabilities = [0.6, 0.4];
            break;
        }
        case 5: {
            probabilities = [0.5, 0.5];
            break;
        }
    }

    if (aDistance > bDistance) {
        return probabilities;
    } else {
        return probabilities.reverse();
    }
}

function getBodyCombos(a: Attribute, b: Attribute) {
    /* Identical, can only be this */
    if (a.name === b.name) {
        return [{ attribute: a, probability: 1 }];
    }

    const [probA, probB] = getBodyProbability(a, b);

    return [{
        attribute: a,
        probability: probA,
    }, {
        attribute: b,
        probability: probB,
    }];
}

function getAttributeProbability(a: Attribute, b: Attribute) {
    const aDistance = attributeDistanceMap.get(a.rarity!)!;
    const bDistance = attributeDistanceMap.get(b.rarity!)!;

    const distance = Math.abs(aDistance - bDistance);

    let probabilities = [0, 0];

    switch (distance) {
        case 0: {
            probabilities = [0.5, 0.5];
            break;
        }
        case 1: {
            probabilities = [0.9, 0.1];
            break;
        }
        case 2: {
            probabilities = [0.8, 0.2];
            break;
        }
        case 3: {
            probabilities = [0.7, 0.3];
            break;
        }
    }

    if (aDistance > bDistance) {
        return probabilities;
    } else {
        return probabilities.reverse();
    }
}

function getCombos(a: Attribute, b: Attribute) {
    /* Identical, can only be this */
    if (a.name === b.name) {
        return [{ attribute: a, probability: 1 }];
    }

    const [probA, probB] = getAttributeProbability(a, b);

    return [{
        attribute: a,
        probability: probA,
    }, {
        attribute: b,
        probability: probB,
    }];
}

export function fuseSouls(a?: Soul, b?: Soul): FusionResult[] {
    if (!a || !b) {
        return [];
    }

    const combinations = [];

    for (const background of getCombos(a.background, b.background)) {
        for (const body of getBodyCombos(a.body, b.body)) {
            for (const eye of getCombos(a.eyes, b.eyes)) {
                for (const mouth of getCombos(a.mouth, b.mouth)) {
                    for (const cheek of getCombos(a.cheeks, b.cheeks)) {
                        for (const glass of getCombos(a.glasses, b.glasses)) {
                            for (const hair of getCombos(a.hair, b.hair)) {
                                for (const hand of getCombos(a.hands, b.hands)) {
                                    const probability = background.probability *
                                        body.probability *
                                        eye.probability *
                                        mouth.probability *
                                        cheek.probability *
                                        glass.probability *
                                        hair.probability *
                                        hand.probability;

                                    combinations.push({
                                        soul: new Soul(
                                            background.attribute,
                                            body.attribute,
                                            eye.attribute,
                                            mouth.attribute,
                                            cheek.attribute,
                                            glass.attribute,
                                            hair.attribute,
                                            hand.attribute,
                                        ),
                                        probability,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return combinations.sort((a, b) => b.probability - a.probability);
}
