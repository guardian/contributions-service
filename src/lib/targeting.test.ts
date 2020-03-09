import { isRecentOneOffContributor, shouldNotRenderEpic, shouldThrottle } from './targeting';
import { EpicTargeting } from '../components/ContributionsEpicTypes';
import testData from '../components/ContributionsEpic.testData';

// Note, this is okay because JS is single-threaded, but will cause issues once
// tests include async code so really it is not very robust.
const withNowAs = <T>(now: Date, fn: () => T): T => {
    const old = Date.now;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    Date.now = () => now.valueOf(); // override
    const got = fn();
    Date.now = old;

    return got;
};

describe('isRecentOneOffContributor', () => {
    const now = new Date('2020-02-12T10:24:00');

    it('returns true for recent date', () => {
        const got = isRecentOneOffContributor(new Date('2020-02-10T10:24:00'), now);
        expect(got).toBe(true);
    });

    it('returns false for older date', () => {
        const got = isRecentOneOffContributor(new Date('2019-02-10T10:24:00'), now);
        expect(got).toBe(false);
    });

    it('returns false for someone that has never contributed', () => {
        const got = isRecentOneOffContributor(undefined, now);
        expect(got).toBe(false);
    });
});

describe('shouldNotRenderEpic', () => {
    const meta: EpicTargeting = testData.targeting;

    it('returns true for non-article', () => {
        const data = { ...meta, contentType: 'Liveblog' };
        const got = shouldNotRenderEpic(data);
        expect(got).toBe(true);
    });

    it('returns true for recent contributor', () => {
        const data = { ...meta, lastOneOffContributionDate: 1557480240000 };
        const got = withNowAs(new Date('2019-06-11T10:24:00'), () => shouldNotRenderEpic(data));
        expect(got).toBe(true);
    });

    it('returns true for blacklisted section', () => {
        const data = { ...meta, sectionName: 'careers' };
        const got = shouldNotRenderEpic(data);
        expect(got).toBe(true);
    });

    it('returns false for valid data', () => {
        const data = {
            contentType: 'Article',
            sectionName: 'culture',
            shouldHideReaderRevenue: false,
            isMinuteArticle: false,
            isPaidContent: false,
            isRecurringContributor: false,
            tags: [],
            showSupportMessaging: true,
        };
        const got = shouldNotRenderEpic(data);
        expect(got).toBe(false);
    });
});

describe('shouldThrottle', () => {
    it('returns true if epic was viewed too recently', () => {
        const config = { maxViewsDays: 90, maxViewsCount: 4, minDaysBetweenViews: 2 };
        const now = new Date('2019-06-12T10:24:00');

        // Epic viewed just now
        const viewLog1 = [{ date: new Date('2019-06-12T10:23:59').valueOf(), testId: 'A' }];
        const got1 = shouldThrottle(viewLog1, config, undefined, now);
        expect(got1).toBe(true);

        // Epic viewed yesterday
        const viewLog2 = [{ date: new Date('2019-06-11T10:24:00').valueOf(), testId: 'A' }];
        const got2 = shouldThrottle(viewLog2, config, undefined, now);
        expect(got2).toBe(true);

        // Epic viewed nearly 2 days ago
        const viewLog3 = [{ date: new Date('2019-06-10T10:24:01').valueOf(), testId: 'A' }];
        const got3 = shouldThrottle(viewLog3, config, undefined, now);
        expect(got3).toBe(true);
    });

    it('returns false if epic was not viewed too recently', () => {
        const config = { maxViewsDays: 90, maxViewsCount: 4, minDaysBetweenViews: 2 };
        const now = new Date('2019-06-12T10:24:00');

        // Epic viewed 2 days ago
        const viewLog1 = [{ date: new Date('2019-06-10T10:24:00').valueOf(), testId: 'A' }];
        const got1 = shouldThrottle(viewLog1, config, undefined, now);
        expect(got1).toBe(false);

        // Epic viewed longer ago
        const viewLog2 = [{ date: new Date('2019-06-01T10:24:00').valueOf(), testId: 'A' }];
        const got2 = shouldThrottle(viewLog2, config, undefined, now);
        expect(got2).toBe(false);
    });

    it('returns true if epic was viewed too many times', () => {
        const config = { maxViewsDays: 90, maxViewsCount: 4, minDaysBetweenViews: 5 };
        const now = new Date('2019-07-09T10:24:00');

        // Just above the max number of views for this Epic
        const viewLog = [
            { date: new Date('2019-06-11T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-06-12T10:24:00').valueOf(), testId: 'B' },
            { date: new Date('2019-06-13T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-06-14T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-06-15T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-06-16T10:24:00').valueOf(), testId: 'A' },
        ];
        const got = shouldThrottle(viewLog, config, 'A', now);
        expect(got).toBe(true);
    });

    it('returns false if epic was not viewed too many times', () => {
        const config = { maxViewsDays: 90, maxViewsCount: 4, minDaysBetweenViews: 5 };
        const now = new Date('2019-07-09T10:24:00');

        // Exactly at the max number of views for this Epic
        const viewLog = [
            { date: new Date('2019-06-11T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-06-12T10:24:00').valueOf(), testId: 'B' },
            { date: new Date('2019-06-13T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-06-14T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-06-15T10:24:00').valueOf(), testId: 'A' },
        ];
        const got = shouldThrottle(viewLog, config, 'A', now);
        expect(got).toBe(false);
    });

    it('returns false if epic was viewed too many times even though test was not', () => {
        const config = { maxViewsDays: 90, maxViewsCount: 4, minDaysBetweenViews: 5 };
        const viewLog = [
            { date: new Date('2019-06-11T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-07-11T10:24:00').valueOf(), testId: 'B' },
            { date: new Date('2019-07-15T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-07-15T10:24:00').valueOf(), testId: 'B' },
            { date: new Date('2019-08-11T10:24:00').valueOf(), testId: 'A' },
            { date: new Date('2019-08-12T10:24:00').valueOf(), testId: 'A' },
        ];

        const now = new Date('2019-09-01T10:24:00');
        const got = shouldThrottle(viewLog, config, 'A', now);
        expect(got).toBe(false);
    });
});
