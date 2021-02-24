import React, { useEffect, useRef, useState } from 'react';
import { Engine, Events } from 'matter-js';
import { createInteractiveTiles } from './puzzlesPhysics';
import { getBackgroundTiles, getTextTiles } from './tiles';
import { render } from './render';
import { backgroundCanvas } from './puzzlesOverlayStyles';
import { LINE, TIME } from './constants';

export const PuzzlesCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isWaiting, setIsWaiting] = useState<boolean>(true);
    const [matterEngine, setMatterEngine] = useState<Engine | null>(null);

    function runEngine() {
        if (isWaiting && matterEngine) {
            Engine.run(matterEngine);
            setIsWaiting(false);
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.canvas.width = context.canvas.parentElement?.offsetWidth ?? 0;
            context.canvas.height = context.canvas.parentElement?.offsetHeight ?? 0;

            context.lineWidth = LINE.WIDTH;
            context.strokeStyle = LINE.STROKE;

            const { engine, physicalBackgroundTiles, physicalTextTiles } = createInteractiveTiles(
                context,
                getBackgroundTiles(),
                getTextTiles(),
            );

            Events.on(engine, 'afterUpdate', () => {
                // tween the timescale for bullet time slow-mo
                if (engine.timing.timeScale < TIME.NORMAL) {
                    engine.timing.timeScale += (TIME.NORMAL - engine.timing.timeScale) * TIME.SLOW;
                }
            });

            setMatterEngine(engine);
            render(context, [...physicalBackgroundTiles, ...physicalTextTiles]);

            return () => Engine.clear(engine);
        }
        return () => undefined;
    }, []);

    return <canvas css={backgroundCanvas} ref={canvasRef} onClick={runEngine}></canvas>;
};
