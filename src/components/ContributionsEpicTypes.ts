export type EpicLocalisation = {
    countryCode?: string;
};

export type EpicPageTracking = {
    ophanPageId: string;
    ophanComponentId: string;
    platformId: string;
    referrerUrl: string;
};

export type EpicTestTracking = {
    campaignCode: string;
    abTestName: string;
    abTestVariant: string;
};

export type EpicTracking = EpicPageTracking & EpicTestTracking;

export type Tag = {
    id: string;
    type: string;
};

interface View {
    date: number;
    testId: string;
}
export type ViewLog = View[];

export type WeeklyArticleLog = {
    week: number;
    count: number;
};

export type WeeklyArticleHistory = WeeklyArticleLog[];

export type EpicTargeting = {
    contentType: string;
    sectionName: string;
    shouldHideReaderRevenue: boolean;

    // TODO let's replace these with Design Type/a single property after migration
    isMinuteArticle: boolean;
    isPaidContent: boolean;

    tags: Tag[];
    mvtId?: number;
    epicViewLog?: ViewLog;
    countryCode?: string;
    weeklyArticleHistory?: WeeklyArticleHistory;

    // Note, it turns out that showSupportMessaging (defined in the Members Data
    // API) does not capture every case of recurring contributors or last
    // contributions (i.e. the latter two are not simply a subset of the first -
    // we need all three!).
    showSupportMessaging: boolean;
    isRecurringContributor: boolean;
    lastOneOffContributionDate?: number; // Platform to send undefined or a timestamp date
};

export type EpicPayload = {
    tracking: EpicPageTracking;
    localisation: EpicLocalisation;
    targeting: EpicTargeting;
};
