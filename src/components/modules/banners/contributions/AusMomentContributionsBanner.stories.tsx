import React, { ReactElement } from 'react';
import { AusMomentContributionsBanner } from './AusMomentContributionsBanner';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { StorybookWrapper } from '../../../../utils/StorybookWrapper';
import { TickerCountType, TickerEndType } from '../../../../lib/variants';

export default {
    component: AusMomentContributionsBanner,
    title: 'Components/AusMomentContributionsBanner',
    decorators: [withKnobs],
};

const tracking = {
    ophanPageId: 'kbluzw2csbf83eabedel',
    ophanComponentId: 'ACQUISITIONS_ENGAGEMENT_BANNER',
    platformId: 'GUARDIAN_WEB',
    clientName: 'dcr',
    referrerUrl: 'http://localhost:3030/Article',
    abTestName: 'AusMomentContributionsBanner',
    abTestVariant: 'control',
    campaignCode: 'AusMomentContributionsBanner_control',
};

const tickerSettings = {
    countType: TickerCountType.people,
    endType: TickerEndType.unlimited,
    currencySymbol: '$',
    // Usually we need the ticker copy, but this banner has a very custom ticker
    copy: {
        countLabel: '',
        goalReachedPrimary: '',
        goalReachedSecondary: '',
    },
    tickerData: {
        total: 120_000,
        goal: 150_000,
    },
};

export const defaultStory = (): ReactElement => {
    const isSupporter = boolean('isSupporter', false);
    const total = number('total', 145_000);

    tickerSettings.tickerData.total = total;

    return (
        <StorybookWrapper>
            <AusMomentContributionsBanner
                isSupporter={isSupporter}
                tickerSettings={tickerSettings}
                tracking={tracking}
            />
        </StorybookWrapper>
    );
};

defaultStory.story = { name: 'Aus Moment' };

export const goalReachedStory = (): ReactElement => {
    const isSupporter = boolean('isSupporter', true);
    const total = number('total', 151_000);

    tickerSettings.tickerData.total = total;

    return (
        <StorybookWrapper>
            <AusMomentContributionsBanner
                isSupporter={isSupporter}
                tickerSettings={tickerSettings}
                tracking={tracking}
            />
        </StorybookWrapper>
    );
};

goalReachedStory.story = { name: 'Aus Moment - goal reached' };