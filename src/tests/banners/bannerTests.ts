import { BannerTest, BannerTestGenerator } from '../../types/BannerTypes';
import { retrieveSecondBannerChannel } from '../../lib/env';
import { DigitalSubscriptionsBanner } from './DigitalSubscriptionsBannerTest';
import { GuardianWeeklyBanner } from './GuardianWeeklyBannerTest';
import { defaultBannerTestGenerator } from './DefaultContributionsBannerTest';
import { contributionsBannerAllTestsGenerator } from './ContributionsBannerTests';
import { channel2BannersAllTestsGenerator } from './ChannelBannerTests';
import { cacheAsync } from '../../lib/cache';

const digitalSubscriptionsBannerGenerator: BannerTestGenerator = () =>
    Promise.resolve([DigitalSubscriptionsBanner]);

const guardianWeeklyBannerGenerator: BannerTestGenerator = () =>
    Promise.resolve([GuardianWeeklyBanner]);

const flattenArray = <T>(array: T[][]): T[] => ([] as T[]).concat(...array);

const testGenerators: BannerTestGenerator[] = [
    contributionsBannerAllTestsGenerator,
    ...(retrieveSecondBannerChannel ? [channel2BannersAllTestsGenerator] : []),
    defaultBannerTestGenerator,
    digitalSubscriptionsBannerGenerator,
    guardianWeeklyBannerGenerator,
];

const getTests = (): Promise<BannerTest[]> =>
    Promise.all(
        testGenerators.map(testGenerator => testGenerator()),
    ).then((bannerTests: BannerTest[][]) => flattenArray(bannerTests));

const [, getCachedTests] = cacheAsync<BannerTest[]>(getTests, 60, 'bannerTests');

export { getTests, getCachedTests };
