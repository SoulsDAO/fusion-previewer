import React from 'react';
import { fabric } from 'fabric';

import { Soul } from './Soul';

export interface ISoulCanvasProps {
    soul: Soul;
    id: string;
    probability: number;
    selected: boolean;
    index: number;
    onSelectedChange: (index: number, probability: number) => void;
}

export function SoulCanvas(props: ISoulCanvasProps) {
    const [canvas, setCanvas] = React.useState<fabric.StaticCanvas>();

    const { id, index, soul, probability, selected, onSelectedChange } = props;

    const text = React.useMemo(() => {
        const text = new fabric.Text(`${(probability * 100).toFixed(4)}%`, {
            textAlign: 'right',
            originX: 'right',
            originY: 'top',
            left: 255,
            fontSize: 26,
            fill: selected
                ? '#ffa366'
                : '#e6e6e6',
            fontWeight: 800,
            strokeWidth: 1,
            stroke: '#000000',
            fontFamily: 'Roboto',
        });

        text.selectable = false;

        return text;
    }, [probability, selected]);

    React.useEffect(() => {
        const canvasObj = new fabric.Canvas(id, {
            width: 256,
            height: 256,
        });

        canvasObj.selection = false;
        canvasObj.on('mouse:down', () => onSelectedChange(index, probability));

        setCanvas(canvasObj);
    // eslint-disable-next-line
    }, [id]);

    React.useEffect(() => {
        const drawData = async () => {
            if (canvas) {
                soul.setCanvas(canvas);
                await soul.draw();
                canvas.add(text);
                canvas.renderAll();
            }
        };

        drawData();
    }, [canvas, soul, text]);

    return (
        <canvas
            id={props.id}
            style={{
                height: '256px',
                width: '256px',
            }}
        >
        </canvas>
    );
}
