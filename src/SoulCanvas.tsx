import React from 'react';
import { fabric } from 'fabric';

import { Soul } from './Soul';

export interface ISoulCanvasProps {
    soul: Soul;
    id: string;
    probability: number;
}

export function SoulCanvas(props: ISoulCanvasProps) {
    const [canvas, setCanvas] = React.useState<fabric.StaticCanvas>();

    const { id, soul, probability } = props;

    const text = React.useMemo(() => (
        new fabric.Text(`${(probability * 100).toFixed(4)}%`, {
            textAlign: 'right',
            originX: 'right',
            originY: 'top',
            left: 255,
            fontSize: 26,
            fill: '#e6e6e6',
            fontWeight: 800,
            strokeWidth: 1,
            stroke: '#000000',
            fontFamily: 'Roboto',
        })
    ), [probability]);

    React.useEffect(() => {
        const canvasObj = new fabric.StaticCanvas(id, {
            width: 256,
            height: 256,
        });

        setCanvas(canvasObj);
    }, [id]);

    React.useEffect(() => {
        const drawData = async () => {
            if (canvas) {
                soul.setCanvas(canvas);
                await soul.draw();
                canvas.add(text);
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
