import React from 'react';
import { fabric } from 'fabric';
import { Button, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import {
    backgrounds,
    bodies,
    mouths,
    hair,
    hands,
    glasses,
    eyes,
    cheeks,
} from './Images';
import { Attribute, Rarity } from './Types';
import { Soul } from './Soul';

export interface ISoulPickerProps {
    /* Need an id so we have a unique canvas per soulpicker */
    id: string;

    /* Style of configuration div on the left */
    configLeftStyles?: React.CSSProperties;

    /* Style of configuration div on the right */
    configRightStyles?: React.CSSProperties;

    /* Styles for the soul picker div */
    styles?: React.CSSProperties;

    /* Include the randomize soul button? */
    includeRandomButton?: boolean;

    /* Include the customize soul attributes inputs? */
    includeConfigurationOptions?: boolean;

    /* Call this function when a new soul is selected / generated */
    onSoulChange?: (soul: Soul) => void;
}

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 256;

export function pickRandomAttributeImg(items: any, allowEmpty?: boolean, emptyProbability?: number) {
    return pickRandomAttribute(items, allowEmpty, emptyProbability).image.default;
}

export function pickRandomAttribute(items: any, allowEmpty?: boolean, emptyProbability?: number) {
    const attributes = [...items];
    
    if (allowEmpty) {
        if (emptyProbability) {
            if (emptyProbability < 0 || emptyProbability > 1) {
                throw new Error('Probability should be between 0 and 1');
            }

            const random = Math.random();

            if (random < emptyProbability) {
                return { name: 'None', image: { default: '' }, rarity: Rarity.None };
            }
        } else {
            attributes.push({ name: 'None', image: { default: '' }, rarity: Rarity.None });
        }
    }

    return items[Math.floor(Math.random() * items.length)];
}

export function SoulPicker(props: ISoulPickerProps) {
    const [canvas, setCanvas] = React.useState<fabric.StaticCanvas>();
    
    const backgroundOptions = [...backgrounds];
    const bodyOptions = [...bodies];
    const mouthOptions = [...mouths];
    const hairOptions = [...hair];
    const handOptions = [...hands];
    const glassesOptions = [...glasses];
    const eyeOptions = [...eyes];
    const cheekOptions = [...cheeks];

    for (const arr of [backgroundOptions, bodyOptions, mouthOptions, hairOptions, handOptions, glassesOptions, cheekOptions]) {
        arr.sort((a, b) => a.name.localeCompare(b.name));

        arr.unshift({
            name: 'None',
            image: { default: '' },
            rarity: Rarity.None,
        })
    }

    const [backgroundVal, setBackground] = React.useState<Attribute>(pickRandomAttribute(backgrounds));
    const [bodyVal, setBody] = React.useState<Attribute>(pickRandomAttribute(bodies));
    const [eyesVal, setEyes] = React.useState<Attribute>(pickRandomAttribute(eyes));
    const [mouthsVal, setMouth] = React.useState<Attribute>(pickRandomAttribute(mouths));
    const [cheeksVal, setCheeks] = React.useState<Attribute>(pickRandomAttribute(cheeks, true));
    const [glassesVal, setGlasses] = React.useState<Attribute>(pickRandomAttribute(glasses, true, 0.5));
    const [hairVal, setHair] = React.useState<Attribute>(pickRandomAttribute(hair, true, 0.3));
    const [handsVal, setHands] = React.useState<Attribute>(pickRandomAttribute(hands, true, 0.5));

    const { onSoulChange } = props;

    React.useEffect(() => {
        const canvasObj = new fabric.StaticCanvas(`canvas-${props.id}`, {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
        });

        setCanvas(canvasObj);
    }, [props.id]);

    React.useEffect(() => {
        if (canvas) {
            const soul = new Soul(
                backgroundVal,
                bodyVal,
                eyesVal,
                mouthsVal,
                cheeksVal,
                glassesVal,
                hairVal,
                handsVal,
            );

            soul.setCanvas(canvas);

            soul.draw();

            if (onSoulChange) {
                onSoulChange(soul);
            }
        }
    }, [
        onSoulChange,
        canvas,
        backgroundVal,
        bodyVal,
        eyesVal,
        mouthsVal,
        cheeksVal,
        glassesVal,
        hairVal,
        handsVal,
    ]);

    function handleRandomButton() {
        if (!canvas) {
            return;
        }

        setBackground(pickRandomAttribute(backgrounds));
        setBody(pickRandomAttribute(bodies));
        setEyes(pickRandomAttribute(eyes));
        setMouth(pickRandomAttribute(mouths));
        setCheeks(pickRandomAttribute(cheeks, true));
        setGlasses(pickRandomAttribute(glasses, true, 0.5));
        setHair(pickRandomAttribute(hair, true, 0.3));
        setHands(pickRandomAttribute(hands, true, 0.5));
    }

    function handleDownload() {
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'Soul.png';
            link.click();
        }
    }

    function handleAttributeChange(event: React.ChangeEvent<{}>, newValue: Attribute | null, setStateFunc: any) {
        if (newValue !== null) {
            setStateFunc(newValue);
        }
    }

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                justifyContent: 'center',
                padding: '1rem',
            }}>
                {props.includeConfigurationOptions &&
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '30px',
                            ...props.configLeftStyles,
                        }}
                    >
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setBackground)}
                            value={backgroundVal}
                            options={backgroundOptions}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Background" variant="outlined"/>}
                            style={{
                                width: '200px',
                            }}
                        />
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setBody)}
                            options={bodyOptions}
                            value={bodyVal}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Bodies" variant="outlined"/>}
                            style={{
                                width: '200px',
                                marginTop: '11px',
                            }}
                        />
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setMouth)}
                            options={mouthOptions}
                            value={mouthsVal}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Mouths" variant="outlined"/>}
                            style={{
                                width: '200px',
                                marginTop: '11px',
                            }}
                        />
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setHair)}
                            options={hairOptions}
                            value={hairVal}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Hair" variant="outlined"/>}
                            style={{
                                width: '200px',
                                marginTop: '11px',
                            }}
                        />

                    </div>
                }
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '256px',
                        ...props.styles,
                    }}
                >
                    <canvas
                        id={`canvas-${props.id}`}
                        style={{
                            height: '256px',
                            width: '256px',
                        }}
                    >
                    </canvas>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '15px',
                        }}
                    >
                        {props.includeRandomButton && <Button
                            variant="contained"
                            color="primary"
                            style={{
                                width: '150px',
                                marginRight: '5px',
                            }}
                            onClick={handleRandomButton}
                            size="small"
                        >
                            Random
                        </Button>}
                        <Button
                            variant="contained"
                            color="primary"
                            style={{
                                width: '150px',
                                marginLeft: props.includeRandomButton
                                    ? '5px'
                                    : undefined,
                            }}
                            onClick={handleDownload}
                            size="small"
                        >
                            Download Image
                        </Button>
                    </div>
                </div>
                {props.includeConfigurationOptions &&
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '30px',
                            ...props.configRightStyles,
                        }}
                    >
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setHands)}
                            options={handOptions}
                            value={handsVal}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Hands" variant="outlined"/>}
                            style={{
                                width: '200px',
                            }}
                        />
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setGlasses)}
                            options={glassesOptions}
                            value={glassesVal}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Glasses" variant="outlined"/>}
                            style={{
                                width: '200px',
                                marginTop: '11px',
                            }}
                        />
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setEyes)}
                            options={eyeOptions}
                            value={eyesVal}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Eyes" variant="outlined"/>}
                            style={{
                                width: '200px',
                                marginTop: '11px',
                            }}
                        />
                        <Autocomplete
                            onChange={(e, v) => handleAttributeChange(e, v, setCheeks)}
                            options={cheekOptions}
                            value={cheeksVal}
                            getOptionLabel={(option) => option.name}
                            getOptionSelected={(option, value) => option.name === value.name}
                            renderInput={(params) => <TextField {...params} label="Cheeks" variant="outlined"/>}
                            style={{
                                width: '200px',
                                marginTop: '11px',
                            }}
                        />
                    </div>
                }
            </div>
        </>
    );
}
