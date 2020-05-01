import { hasSectionOrTags } from './hasSectionOrTags';
import { EpicTargeting } from '../../components/ContributionsEpicTypes';
import { testDefault, targetingDefault } from '../variants.test';
import { Test } from '../variants';

describe('getUserCohort filter', () => {
    it('should return true if section matches', () => {
        const test: Test = {
            ...testDefault,
            sections: ['environment'],
        };
        const targeting: EpicTargeting = {
            ...targetingDefault,
            sectionName: 'environment',
        };
        const got = hasSectionOrTags.test(test, targeting);
        expect(got).toBe(true);
    });

    it('should return false if section doesn not match and no tags defined', () => {
        const test: Test = {
            ...testDefault,
            sections: ['environment'],
        };
        const targeting: EpicTargeting = {
            ...targetingDefault,
            sectionName: 'business',
        };
        const got = hasSectionOrTags.test(test, targeting);
        expect(got).toBe(false);
    });

    it('should return false if section doesn not match and no tags defined', () => {
        const tags = [
            {
                id: 'environment/series/the-polluters',
                type: 'tone',
            },
        ];
        const test: Test = {
            ...testDefault,
            sections: ['environment'],
            tagIds: tags.map(tag => tag.id),
        };
        const targeting: EpicTargeting = {
            ...targetingDefault,
            sectionName: 'business',
            tags: tags,
        };
        const got = hasSectionOrTags.test(test, targeting);
        expect(got).toBe(true);
    });

    it('should return false if neither sections or tags match', () => {
        const tags = [
            {
                id: 'environment/series/the-polluters',
                type: 'tone',
            },
        ];
        const test: Test = {
            ...testDefault,
            sections: ['environment'],
            tagIds: tags.map(tag => tag.id),
        };
        const targeting: EpicTargeting = {
            ...targetingDefault,
            sectionName: 'business',
            tags: [
                {
                    id: 'business/some-business-tag',
                    type: 'tone',
                },
            ],
        };
        const got = hasSectionOrTags.test(test, targeting);
        expect(got).toBe(false);
    });

    it('should return true if no section or tag requirements', () => {
        const test: Test = {
            ...testDefault,
            sections: [],
            tagIds: [],
        };
        const targeting: EpicTargeting = {
            ...targetingDefault,
            sectionName: 'business',
        };
        const got = hasSectionOrTags.test(test, targeting);
        expect(got).toBe(true);
    });
});
