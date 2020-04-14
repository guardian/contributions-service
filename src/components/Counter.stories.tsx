import React, { ReactElement } from 'react';
import { Counter } from './Counter';
import { withKnobs } from '@storybook/addon-knobs';
import { StorybookWrapper } from '../utils/StorybookWrapper';

export default {
    component: Counter,
    title: 'Components/Counter',
    decorators: [withKnobs],
};

export const defaultStory = (): ReactElement => {
    return (
        <StorybookWrapper>
            <Counter />
        </StorybookWrapper>
    );
};

defaultStory.story = { name: 'Default counter' };
