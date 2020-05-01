import { getUserCohorts } from './getUserCohorts';
import { EpicTargeting } from '../../components/ContributionsEpicTypes';
import { targetingDefault } from '../variants.test';
import { withNowAs } from '../../utils/withNowAs';

describe('getUserCohort filter', () => {
    const now = new Date('2020-03-31T12:30:00');
    const twoMonthsAgo = new Date(now).setMonth(now.getMonth() - 2);

    it('should return "AllNonSupporters" when users is not contributor', () => {
        const targeting = {
            ...targetingDefault,
            showSupportMessaging: true,
            isRecurringContributor: false,
            lastOneOffContributionDate: undefined,
        };
        const got = getUserCohorts(targeting);
        expect(got).toEqual(['AllNonSupporters', 'Everyone']);
    });

    it('should return "AllExistingSupporters" when user is recurring contributor', () => {
        const targeting: EpicTargeting = {
            ...targetingDefault,
            isRecurringContributor: true,
        };
        const got = getUserCohorts(targeting);
        expect(got).toEqual(['AllExistingSupporters', 'Everyone']);
    });

    it('should return "AllExistingSupporters" when user has some form of paid product', () => {
        const targeting: EpicTargeting = {
            ...targetingDefault,
            showSupportMessaging: false,
        };
        const got = getUserCohorts(targeting);
        expect(got).toEqual(['AllExistingSupporters', 'Everyone']);
    });

    it('should return "AllExistingSupporters" when user has recent one-off contribution', () => {
        const targeting: EpicTargeting = {
            ...targetingDefault,
            lastOneOffContributionDate: twoMonthsAgo,
        };
        const got = withNowAs(now, () => getUserCohorts(targeting));
        expect(got).toEqual(['AllExistingSupporters', 'Everyone']);
    });

    it('should return "PostAskPauseSingleContributors" when user has older one-off contribution', () => {
        const now = new Date('2020-03-31T12:30:00');
        const fourMonthsAgo = new Date(now).setMonth(now.getMonth() - 4);

        const targeting: EpicTargeting = {
            ...targetingDefault,
            showSupportMessaging: true,
            isRecurringContributor: false,
            lastOneOffContributionDate: fourMonthsAgo,
        };
        const got = withNowAs(now, () => getUserCohorts(targeting));
        expect(got).toEqual(['PostAskPauseSingleContributors', 'AllNonSupporters', 'Everyone']);
    });
});
