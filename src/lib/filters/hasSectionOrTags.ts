import { EpicTargeting } from '../../components/ContributionsEpicTypes';
import { Test, Filter } from '../variants';

export const hasSectionOrTags: Filter = {
    id: 'hasSectionOrTags',
    test: (test: Test, targeting: EpicTargeting): boolean => {
        const cleanedTags = test.tagIds.filter(tagId => tagId !== '');

        if (cleanedTags.length === 0 && test.sections.length === 0) {
            return true;
        }

        const intersectingTags = cleanedTags.filter(tagId =>
            targeting.tags.map(tag => tag.id).includes(tagId),
        );

        const hasSection = test.sections.includes(targeting.sectionName);
        const hasTags = intersectingTags.length > 0;

        return hasSection || hasTags;
    },
};
