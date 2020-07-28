import fetch from 'node-fetch';
import { BannerTestGenerator, BannerContent, BannerTest } from '../../types/BannerTypes';

export const DefaultContributionsBannerPath = 'contributions-banner.js';

const defaultBannerContentUrl =
    'https://interactive.guim.co.uk/docsdata/1CIHCoe87hyPHosXx1pYeVUoohvmIqh9cC_kNlV-CMHQ.json';

const DefaultContributionsBanner = (bannerContent: BannerContent): BannerTest => {
    return {
        name: 'DefaultContributionsBanner',
        bannerType: 'contributions',
        testAudience: 'NonSupporters',
        componentType: 'ACQUISITIONS_ENGAGEMENT_BANNER',
        canRun: (): boolean => true,
        minPageViews: 2,
        variants: [
            {
                name: 'control',
                modulePath: DefaultContributionsBannerPath,
                moduleName: 'ContributionsBanner',
                bannerContent: bannerContent,
            },
        ],
    };
};

const defaultBannerTest = (bannerContent: BannerContent): BannerTest => {
    return DefaultContributionsBanner(bannerContent);
};

export const defaultBannerTestGenerator: BannerTestGenerator = () =>
    fetch(defaultBannerContentUrl)
        .then(response => response.json())
        .then(json => json['sheets']['control'][0])
        .then(defaultBannerContent => {
            return defaultBannerTest({
                messageText: defaultBannerContent.messageText,
                highlightedText: defaultBannerContent.ctaText,
                cta: {
                    baseUrl: defaultBannerContent.linkUrl,
                    text: defaultBannerContent.buttonCaption,
                },
            });
        });
