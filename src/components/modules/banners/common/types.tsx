import { ReminderFields } from '../../../../lib/reminderFields';
import { SecondaryCtaType } from '../../../../types/shared';

export type BannerId =
    | 'contributions-banner'
    | 'g200-banner'
    | 'subscription-banner'
    | 'weekly-banner';

export interface BannerEnrichedCta {
    ctaUrl: string;
    ctaText: string;
}

export interface BannerEnrichedCustomCta {
    type: SecondaryCtaType.Custom;
    cta: BannerEnrichedCta;
}

export interface BannerEnrichedReminderCta {
    type: SecondaryCtaType.ContributionsReminder;
    reminderFields: ReminderFields;
}

export type BannerEnrichedSecondaryCta = BannerEnrichedCustomCta | BannerEnrichedReminderCta;

export interface ContributionsReminderTracking {
    onReminderCtaClick: () => void;
    onReminderSetClick: () => void;
    onReminderCloseClick: () => void;
}

export interface BannerRenderedContent {
    heading: JSX.Element | JSX.Element[] | null;
    messageText: JSX.Element | JSX.Element[];
    highlightedText?: JSX.Element[] | null;
    primaryCta: BannerEnrichedCta | null;
    secondaryCta: BannerEnrichedSecondaryCta | null;
}

export interface BannerTextContent {
    mainContent: BannerRenderedContent;
    mobileContent?: BannerRenderedContent;
}

export interface BannerRenderProps {
    onCtaClick: () => void;
    onSecondaryCtaClick: () => void;
    onNotNowClick: () => void;
    onCloseClick: () => void;
    onSignInClick?: () => void;
    reminderTracking: ContributionsReminderTracking;
    content: BannerTextContent;
    countryCode?: string;
    email?: string;
}
