import express from 'express';
import { fetchConfiguredEpicTests } from './api/contributionsApi';
import { cacheAsync } from './lib/cache';
import {
    EpicPageTracking,
    EpicTargeting,
    EpicTestTracking,
    EpicType,
} from './components/modules/epics/ContributionsEpicTypes';
import { Debug, findTestAndVariant, Result, Variant, Test } from './lib/variants';
import { getArticleViewCountForWeeks } from './lib/history';
import { buildBannerCampaignCode, buildCampaignCode } from './lib/tracking';

import { getAllHardcodedTests } from './tests';
import { Params } from './lib/params';
import { EpicProps } from './components/modules/epics/ContributionsEpic';
import { baseUrl } from './lib/env';
import { addTickerDataToSettings, addTickerDataToVariant } from './lib/fetchTickerData';
import {
    BannerPageTracking,
    BannerProps,
    BannerTargeting,
    BannerTestTracking,
    BannerTracking,
    PuzzlesBannerProps,
} from './types/BannerTypes';
import { selectBannerTest } from './tests/banners/bannerSelection';
import { getCachedTests } from './tests/banners/bannerTests';
import { bannerDeployCaches } from './tests/banners/bannerDeployCache';
import { epic as epicModule, liveblogEpic as liveblogEpicModule, puzzlesBanner } from './modules';
import {
    epicSeparateArticleCountTestEuRow,
    epicSeparateArticleCountTestUkAus,
} from './tests/epicArticleCountTest';

interface EpicDataResponse {
    data?: {
        module: {
            url: string;
            props: EpicProps;
        };
        variant: Variant;
        meta: EpicTestTracking;
    };
    debug?: Debug;
}

interface BannerDataResponse {
    data?: {
        module: {
            url: string;
            name: string;
            props: BannerProps;
        };
        meta: BannerTestTracking;
    };
    debug?: Debug;
}

interface PuzzlesDataResponse {
    data?: {
        module: {
            url: string;
            name: string;
            props: PuzzlesBannerProps;
        };
        meta: Record<string, unknown>;
    };
    debug?: Debug;
}

const [, fetchConfiguredArticleEpicTestsCached] = cacheAsync(
    () => fetchConfiguredEpicTests('ARTICLE'),
    60,
    `fetchConfiguredEpicTests_ARTICLE`,
);

const [, fetchConfiguredArticleEpicHoldbackTestsCached] = cacheAsync(
    () => fetchConfiguredEpicTests('ARTICLE_HOLDBACK'),
    60,
    `fetchConfiguredEpicTests_ARTICLE_HOLDBACK`,
);

const [, fetchConfiguredLiveblogEpicTestsCached] = cacheAsync(
    () => fetchConfiguredEpicTests('LIVEBLOG'),
    60,
    `fetchConfiguredEpicTests_LIVEBLOG`,
);

const getArticleEpicTests = async (mvtId: number): Promise<Test[]> => {
    const shouldHoldBack = mvtId % 100 === 0; // holdback 1% of the audience
    if (shouldHoldBack) {
        const holdback = await fetchConfiguredArticleEpicHoldbackTestsCached();
        return holdback.tests;
    }
    const regular = await fetchConfiguredArticleEpicTestsCached();
    const hardCoded = await getAllHardcodedTests();

    return [
        epicSeparateArticleCountTestUkAus,
        epicSeparateArticleCountTestEuRow,
        ...regular.tests,
        ...hardCoded,
    ];
};

const getForceableArticleEpicTests = async (): Promise<Test[]> => {
    const regular = await fetchConfiguredArticleEpicTestsCached();
    const hardCoded = await getAllHardcodedTests();
    const holdback = await fetchConfiguredArticleEpicHoldbackTestsCached();

    return [
        epicSeparateArticleCountTestUkAus,
        epicSeparateArticleCountTestEuRow,
        ...regular.tests,
        ...hardCoded,
        ...holdback.tests,
    ];
};

const getLiveblogEpicTests = async (): Promise<Test[]> => {
    const configuredTests = await fetchConfiguredLiveblogEpicTestsCached();
    return [...configuredTests.tests];
};

export const buildEpicData = async (
    pageTracking: EpicPageTracking,
    targeting: EpicTargeting,
    type: EpicType,
    params: Params,
    baseUrl: string,
): Promise<EpicDataResponse> => {
    let result: Result;

    if (params.force) {
        const tests = await (type === 'ARTICLE'
            ? getForceableArticleEpicTests()
            : getLiveblogEpicTests());

        const test = tests.find(test => test.name === params.force?.testName);
        const variant = test?.variants.find(v => v.name === params.force?.variantName);
        result = test && variant ? { result: { test, variant } } : {};
    } else {
        const tests = await (type === 'ARTICLE'
            ? getArticleEpicTests(targeting.mvtId || 0)
            : getLiveblogEpicTests());

        result = findTestAndVariant(tests, targeting, type, params.debug);
    }

    if (process.env.log_targeting === 'true') {
        console.log(
            `Renders Epic ${result ? 'true' : 'false'} for targeting: ${JSON.stringify(targeting)}`,
        );
    }

    if (!result.result) {
        return { data: undefined, debug: result.debug };
    }

    const { test, variant } = result.result;

    const variantWithTickerData = await addTickerDataToVariant(variant);

    const testTracking: EpicTestTracking = {
        abTestName: test.name,
        abTestVariant: variant.name,
        campaignCode: buildCampaignCode(test, variant),
        campaignId: `epic_${test.campaignId || test.name}`,
        componentType: 'ACQUISITIONS_EPIC',
        products: ['CONTRIBUTION', 'MEMBERSHIP_SUPPORTER'],
    };

    const props: EpicProps = {
        variant: variantWithTickerData,
        tracking: { ...pageTracking, ...testTracking },
        numArticles: getArticleViewCountForWeeks(
            targeting.weeklyArticleHistory,
            test.articlesViewedSettings?.periodInWeeks,
        ),
        countryCode: targeting.countryCode,
    };

    const modulePathBuilder: (version?: string) => string =
        variantWithTickerData.modulePathBuilder ||
        (type === 'ARTICLE'
            ? epicModule.endpointPathBuilder
            : liveblogEpicModule.endpointPathBuilder);

    return {
        data: {
            variant: variantWithTickerData,
            meta: testTracking,
            module: {
                url: `${baseUrl}/${modulePathBuilder(targeting.modulesVersion)}`,
                props,
            },
        },
        debug: result.debug,
    };
};

export const buildBannerData = async (
    pageTracking: BannerPageTracking,
    targeting: BannerTargeting,
    params: Params,
    req: express.Request,
): Promise<BannerDataResponse> => {
    const selectedTest = await selectBannerTest(
        targeting,
        pageTracking,
        baseUrl(req),
        getCachedTests,
        bannerDeployCaches,
        params.force,
    );

    if (selectedTest) {
        const { test, variant, moduleUrl, moduleName } = selectedTest;

        const testTracking: BannerTestTracking = {
            abTestName: test.name,
            abTestVariant: variant.name,
            campaignCode: buildBannerCampaignCode(test, variant),
            componentType: variant.componentType,
            ...(variant.products && { products: variant.products }),
        };

        const tickerSettings = variant.tickerSettings
            ? await addTickerDataToSettings(variant.tickerSettings)
            : undefined;

        const props: BannerProps = {
            tracking: { ...pageTracking, ...testTracking },
            bannerChannel: test.bannerChannel,
            isSupporter: !targeting.showSupportMessaging,
            countryCode: targeting.countryCode,
            content: variant.bannerContent,
            mobileContent: variant.mobileBannerContent,
            numArticles: getArticleViewCountForWeeks(
                targeting.weeklyArticleHistory,
                test.articlesViewedSettings?.periodInWeeks,
            ),
            hasOptedOutOfArticleCount: targeting.hasOptedOutOfArticleCount,
            tickerSettings,
        };

        return {
            data: {
                module: {
                    url: moduleUrl,
                    name: moduleName,
                    props: props,
                },
                meta: testTracking,
            },
        };
    } else {
        // No banner
        return { data: undefined };
    }
};

export const buildPuzzlesData = async (
    pageTracking: BannerPageTracking,
    targeting: BannerTargeting,
    params: Params,
    req: express.Request,
): Promise<PuzzlesDataResponse> => {
    const puzzlesTracking: Partial<BannerTracking> = {
        componentType: 'ACQUISITIONS_OTHER',
    };
    if (targeting.showSupportMessaging) {
        return {
            data: {
                module: {
                    url: `${baseUrl(req)}/${puzzlesBanner.endpointPathBuilder(
                        targeting ? targeting.modulesVersion : targeting,
                    )}`,
                    name: 'PuzzlesBanner',
                    props: {
                        tracking: {
                            ...pageTracking,
                            ...puzzlesTracking,
                        },
                    },
                },
                meta: {},
            },
        };
    }
    return {};
};
