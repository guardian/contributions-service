import { EpicTests } from '../lib/variants';

export const configuredTests: EpicTests = {
    tests: [
        {
            name: '2020-02-11_enviro_fossil_fuel_r2_Epic__no_article_count',
            isOn: true,
            locations: [],
            tagIds: [
                'environment/series/the-polluters',
                'environment/environment',
                'environment/the-forgotten-climate-change-crises',
                'environment/drought',
                'environment/endangered-habitats',
                'environment/endangeredspecies',
                'environment/climate-change',
                'environment/activism',
                'environment/climate-change',
                'science/scienceofclimatechange',
                'environment/renewableenergy',
                'environment/series/our-wide-brown-land',
                'environment/extinction-rebellion',
                'us-news/series/toxic-america',
                'us-news/series/cancer-town',
                'us-news/series/united-states-of-plastic',
                'world/natural-disasters',
            ],
            sections: ['environment'],
            excludedTagIds: ['world/coronavirus-outbreak'],
            excludedSections: [],
            alwaysAsk: true,
            maxViews: {
                maxViewsCount: 4,
                maxViewsDays: 30,
                minDaysBetweenViews: 0,
            },
            userCohort: 'AllNonSupporters',
            isLiveBlog: false,
            hasCountryName: false,
            variants: [
                {
                    name: 'Control',
                    heading: "We've got an announcement…",
                    paragraphs: [
                        '… on our progress as an organisation. In service of the escalating climate emergency, we have made an important decision – <a href="https://www.theguardian.com/media/2020/jan/29/guardian-to-ban-advertising-from-fossil-fuel-firms-climate-crisis">to renounce fossil fuel advertising</a>, becoming the first major global news organisation to institute an outright ban on taking money from companies that extract fossil fuels.',
                        '',
                        "In October we outlined our pledge: that the Guardian will give global heating, wildlife extinction and pollution the urgent attention and prominence they demand. This resonated with so many readers around the world. We promise to update you on the steps we take to hold ourselves accountable at this defining point in our lifetimes. With climate misinformation rife, and never more dangerous than now, the Guardian's accurate, authoritative reporting is vital – and we will not stay quiet.",
                        '',
                        "We chose a different approach: to keep Guardian journalism open for all. We don't have a paywall because we believe everyone deserves access to factual information, regardless of where they live or what they can afford to pay.",
                        '',
                        'Our editorial independence means we are free to investigate and challenge inaction by those in power. We will inform our readers about threats to the environment based on scientific facts, not driven by commercial or political interests. And we have made several important changes to our style guide to ensure the language we use accurately reflects the environmental emergency. ',
                        '',
                        'The Guardian believes that the problems we face on the climate crisis are systemic and that fundamental societal change is needed. We will keep reporting on the efforts of individuals and communities around the world who are fearlessly taking a stand for future generations and the preservation of human life on earth. We want their stories to inspire hope.',
                        '',
                        'We hope you will consider supporting us today. We need your support to keep delivering quality journalism that’s open and independent. Every reader contribution, however big or small, is so valuable.',
                    ],
                    highlightedText:
                        'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.',
                    showTicker: false,
                    cta: {
                        text: 'Support The Guardian',
                        baseUrl: 'https://support.theguardian.com/contribute',
                    },
                },
            ],
            highPriority: false,
            useLocalViewLog: false,
        },
    ],
};
