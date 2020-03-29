import { EpicTracking, EpicLocalisation, EpicTargeting } from './ContributionsEpicTypes';

const tracking: EpicTracking = {
    ophanPageId: 'k5nxn0mxg7ytwpkxuwms',
    ophanComponentId: 'ACQUISITIONS_EPIC',
    platformId: 'GUARDIAN_WEB',
    campaignCode: 'gdnwb_copts_memco_remote_epic_test_api',
    abTestName: 'remote_epic_test',
    abTestVariant: 'api',
    referrerUrl:
        'http://localhost:3000/politics/2020/jan/17/uk-rules-out-automatic-deportation-of-eu-citizens-verhofstadt-brexit',
};

const localisation: EpicLocalisation = {
    countryCode: 'GB',
};

const targeting: EpicTargeting = {
    contentType: 'Article',
    sectionName: 'culture',
    shouldHideReaderRevenue: false,
    isMinuteArticle: false,
    isPaidContent: false,
    tags: [
        {
            id: 'culture/david-schwimmer',
            type: 'Keyword',
        },
        {
            id: 'tv-and-radio/friends',
            type: 'Keyword',
        },
        {
            id: 'tone/interview',
            type: 'Tone',
        },
        {
            id: 'publication/theguardian',
            type: 'Publication',
        },
        {
            id: 'profile/davidsmith',
            type: 'Contributor',
        },
    ],
    showSupportMessaging: true,
    isRecurringContributor: false,
    lastOneOffContributionDate: 1548979200000, // 2019-02-01
    mvtId: 2,
    weeklyArticleHistory: [
        { week: 18337, count: 10 },
        { week: 18330, count: 5 },
    ],
};

const testData = { tracking, localisation, targeting };

export default testData;
