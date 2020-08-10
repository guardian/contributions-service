import { TickerSettings } from '../lib/variants';
import { OphanProduct, OphanComponentType, OphanComponentEvent } from './OphanTypes';

// TODO - it may be worth sharing some types with Epic tests

export type BannerTargeting = {
    alreadyVisitedCount: number;
    shouldHideReaderRevenue?: boolean;
    isPaidContent?: boolean;
    showSupportMessaging: boolean;
    engagementBannerLastClosedAt?: string;
    subscriptionBannerLastClosedAt?: string;
    mvtId: number;
    countryCode: string;
    switches: {
        remoteSubscriptionsBanner: boolean;
    };
};

export type BannerTestTracking = {
    abTestName: string;
    abTestVariant: string;
    campaignCode: string;
    componentType: OphanComponentType;
    products?: OphanProduct[];
};

export type BannerPageTracking = {
    ophanPageId: string;
    platformId: string;
    referrerUrl: string;
    clientName: string;
};

export type BannerTracking = BannerTestTracking & BannerPageTracking;

export type BannerDataRequestPayload = {
    tracking: BannerPageTracking;
    targeting: BannerTargeting;
};

export interface Cta {
    text: string;
    baseUrl: string;
}

export interface BannerContent {
    header?: string;
    messageText: string;
    highlightedText?: string;
    cta?: Cta;
}

export interface BannerVariant {
    name: string;
    tickerSettings?: TickerSettings;
    modulePath: string;
    moduleName: string;
    bannerContent?: BannerContent;
}

export type BannerType = 'contributions' | 'subscriptions';
export type CanRun = (targeting: BannerTargeting, pageTracking: BannerPageTracking) => boolean;
export type BannerAudience = 'NonSupporters' | 'Supporters' | 'All';

export type BannerTestGenerator = () => Promise<BannerTest>;

export interface BannerTest {
    name: string;
    bannerType: BannerType;
    testAudience: BannerAudience;
    canRun: CanRun;
    minPageViews: number;
    variants: BannerVariant[];
    componentType: OphanComponentType;
    products?: OphanProduct[];
}

// The result of selecting a test+variant for a user
export interface BannerTestSelection {
    test: BannerTest;
    variant: BannerVariant;
    moduleUrl: string;
    moduleName: string;
}

export interface BannerProps {
    tracking: BannerTracking;
    content?: BannerContent;
    countryCode?: string;
    isSupporter?: boolean;
    tickerSettings?: TickerSettings;
    submitComponentEvent?: (componentEvent: OphanComponentEvent) => void;
}