import React, { ReactElement } from 'react';
import { ContributionsEpic } from './ContributionsEpic';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { StorybookWrapper } from '../utils/StorybookWrapper';
import testData from './ContributionsEpic.testData';
import { Variant } from '../lib/variants';
import { getArticleViewCountForWeeks } from '../lib/history';
import { factories } from '../factories';

export default {
    component: ContributionsEpic,
    title: 'Components/ContributionsEpic',
    decorators: [withKnobs],
};

// Number of articles viewed
// Used to replace the template placeholder
const periodInWeeks = 52;
const numArticles = getArticleViewCountForWeeks(
    testData.targeting.weeklyArticleHistory,
    periodInWeeks,
);

export const defaultStory = (): ReactElement => {
    // Epic content props

    const variantData = factories.variant.build();
    const variant: Variant = {
        name: 'Test Epic',
        heading: text('heading', variantData.heading || ''),
        paragraphs: object('paragraphs', variantData.paragraphs),
        highlightedText: text('highlightedText', variantData.highlightedText || ''),
        showTicker: false,
    };

    // Epic metadata props
    const epicTracking = {
        ophanPageId: text('ophanPageId', testData.tracking.ophanPageId),
        ophanComponentId: text('ophanComponentId', testData.tracking.ophanComponentId),
        platformId: text('platformId', testData.tracking.platformId),
        campaignCode: text('campaignCode', testData.tracking.campaignCode),
        abTestName: text('abTestName', testData.tracking.abTestName),
        abTestVariant: text('abTestVariant', testData.tracking.abTestVariant),
        referrerUrl: text('referrerUrl', testData.tracking.referrerUrl),
    };

    // Epic localisation props
    const epicLocalisation = {
        countryCode: text('countryCode', testData.localisation.countryCode || 'GB'),
    };

    return (
        <StorybookWrapper>
            <ContributionsEpic
                variant={variant}
                tracking={epicTracking}
                localisation={epicLocalisation}
                numArticles={numArticles}
            />
        </StorybookWrapper>
    );
};

defaultStory.story = { name: 'Default epic' };

export const backgroundImageStory = (): ReactElement => {
    // Epic content props
    const variantData = factories.variant.build({
        backgroundImageUrl:
            'https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1701&q=80',
    });

    const variant: Variant = {
        name: 'Test Epic',
        heading: text('heading', variantData.heading || ''),
        paragraphs: object('paragraphs', variantData.paragraphs),
        highlightedText: text('highlightedText', variantData.highlightedText || ''),
        showTicker: false,
        backgroundImageUrl: text('backgroundImageUrl', variantData.backgroundImageUrl || ''),
    };

    // Epic metadata props
    const epicTracking = {
        ophanPageId: text('ophanPageId', testData.tracking.ophanPageId),
        ophanComponentId: text('ophanComponentId', testData.tracking.ophanComponentId),
        platformId: text('platformId', testData.tracking.platformId),
        campaignCode: text('campaignCode', testData.tracking.campaignCode),
        abTestName: text('abTestName', testData.tracking.abTestName),
        abTestVariant: text('abTestVariant', testData.tracking.abTestVariant),
        referrerUrl: text('referrerUrl', testData.tracking.referrerUrl),
    };

    // Epic localisation props
    const epicLocalisation = {
        countryCode: text('countryCode', testData.localisation.countryCode || 'GB'),
    };

    return (
        <StorybookWrapper>
            <ContributionsEpic
                variant={variant}
                tracking={epicTracking}
                localisation={epicLocalisation}
                numArticles={numArticles}
            />
        </StorybookWrapper>
    );
};

backgroundImageStory.story = { name: 'Epic with an image' };

export const secondaryButtonStory = (): ReactElement => {
    // Epic content props
    const variantData = factories.variant.build();
    const variant: Variant = {
        name: 'Test Epic',
        heading: text('heading', variantData.heading || ''),
        paragraphs: object('paragraphs', variantData.paragraphs),
        highlightedText: text('highlightedText', variantData.highlightedText || ''),
        showTicker: false,
        secondaryCta: {
            text: text('secondaryCta.text', variantData.secondaryCta?.text || ''),
            baseUrl: text('secondaryCta.baseUrl', variantData.secondaryCta?.baseUrl || ''),
        },
    };

    // Epic metadata props
    const epicTracking = {
        ophanPageId: text('ophanPageId', testData.tracking.ophanPageId),
        ophanComponentId: text('ophanComponentId', testData.tracking.ophanComponentId),
        platformId: text('platformId', testData.tracking.platformId),
        campaignCode: text('campaignCode', testData.tracking.campaignCode),
        abTestName: text('abTestName', testData.tracking.abTestName),
        abTestVariant: text('abTestVariant', testData.tracking.abTestVariant),
        referrerUrl: text('referrerUrl', testData.tracking.referrerUrl),
    };

    // Epic localisation props
    const epicLocalisation = {
        countryCode: text('countryCode', testData.localisation.countryCode || 'GB'),
    };

    return (
        <StorybookWrapper>
            <ContributionsEpic
                variant={variant}
                tracking={epicTracking}
                localisation={epicLocalisation}
                numArticles={numArticles}
            />
        </StorybookWrapper>
    );
};

secondaryButtonStory.story = { name: 'Epic with Secondary Button' };
