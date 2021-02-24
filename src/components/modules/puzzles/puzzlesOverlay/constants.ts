export const ANGLE = {
    MIN: -0.6,
    MAX: 0.6,
};

export const BACKGROUND = {
    COLOR: '#ffffff',
};

export const BOUNDS = {
    SIZE: 200,
};

export const FORCES = {
    EXPLOSION: 0.1,
};

export const LINE = {
    WIDTH: 3,
    STROKE: '#000000',
};

type TextSize = 'LARGE' | 'LARGE_LETTER' | 'SMALL';

type TextConstant = {
    FONT: string;
    LINE_HEIGHT: number;
    ALIGN: CanvasTextAlign;
    BASELINE: CanvasTextBaseline;
};

export const TEXT: { [key in TextSize]: TextConstant } = {
    LARGE: {
        FONT: '100px GuardianTextSans, sans-serif',
        LINE_HEIGHT: 100,
        ALIGN: 'center',
        BASELINE: 'middle',
    },
    LARGE_LETTER: {
        FONT: 'bold 100px GH Guardian Headline, serif',
        LINE_HEIGHT: 100,
        ALIGN: 'center',
        BASELINE: 'middle',
    },
    SMALL: {
        FONT: 'bold 20px GH Guardian Headline, serif',
        LINE_HEIGHT: 23,
        ALIGN: 'left',
        BASELINE: 'top',
    },
};

export const TILE_SIZE = {
    LARGE: 176,
    SMALL: 120,
};

export const TILE_SHADOW = {
    OFFSET: 6,
    BLUR: 3,
    COLOR: 'rgba(0, 0, 0, 0.25)',
};

export const TILE_PROPERTIES = {
    DENSITY: {
        LIGHT: 0.01,
        HEAVY: 0.02,
    },
    FRICTION: 0.5,
    RESTITUTION: 0.7,
};

export const TIME = {
    NORMAL: 1,
    INTERVAL: 30000,
};
