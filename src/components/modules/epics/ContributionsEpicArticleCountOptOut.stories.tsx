import React from 'react';
import { Story, Meta } from '@storybook/react';
import { EpicDecorator } from './ContributionsEpic.stories';
import {
    ContributionsEpicArticleCountOptOut,
    ContributionsEpicArticleCountOptOutProps,
} from './ContributionsEpicArticleCountOptOut';

export default {
    component: ContributionsEpicArticleCountOptOut,
    title: 'Epics/ContributionsEpicArticleCountOptOut',
    args: {
        numArticles: 989,
        isArticleCountOn: true,
    },
    decorators: [EpicDecorator],
} as Meta;

const Template: Story<ContributionsEpicArticleCountOptOutProps> = (
    props: ContributionsEpicArticleCountOptOutProps,
) => <ContributionsEpicArticleCountOptOut {...props} />;

export const ArticleCountOn = Template.bind({});

export const ArticleCountOff = Template.bind({});

ArticleCountOff.args = {
    isArticleCountOn: false,
};