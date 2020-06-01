import React from 'react';
import { css } from 'emotion';
import { space } from '@guardian/src-foundations';
import { Button } from '../Button';
import { EpicTracking } from '../ContributionsEpicTypes';
import { Cta, Variant } from '../../lib/variants';
import { addTrackingParams } from '../../lib/tracking';
import { addRegionIdToSupportUrl } from '../../lib/geolocation';

const buttonWrapperStyles = css`
    margin: ${space[6]}px ${space[2]}px ${space[1]}px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &.hidden {
        display: none;
    }
`;

const paymentImageStyles = css`
    display: inline-block;
    width: auto;
    height: 25px;
    margin: ${space[1]}px 0;
`;

const buttonMargins = css`
    margin: ${space[1]}px ${space[2]}px ${space[1]}px 0;
`;

const PrimaryCtaButton = ({
    cta,
    tracking,
    countryCode,
}: {
    cta?: Cta;
    tracking: EpicTracking;
    countryCode?: string;
}): JSX.Element | null => {
    if (!cta) {
        return null;
    }

    const buttonText = cta.text || 'Support The Guardian';
    const baseUrl = cta.baseUrl || 'https://support.theguardian.com/contribute';
    const urlWithRegion = addRegionIdToSupportUrl(baseUrl, countryCode);
    const urlWithRegionAndTracking = addTrackingParams(urlWithRegion, tracking);

    return (
        <div className={buttonMargins}>
            <Button onClickAction={urlWithRegionAndTracking} showArrow>
                {buttonText}
            </Button>
        </div>
    );
};

export const ContributionsEpicButtons = ({
    variant,
    tracking,
    countryCode,
    onOpenReminderClick,
}: {
    variant: Variant;
    tracking: EpicTracking;
    countryCode?: string;
    onOpenReminderClick: Function;
}): JSX.Element | null => {
    const { cta, secondaryCta, showReminderFields } = variant;
    if (!cta) {
        return null;
    }

    return (
        <div className={buttonWrapperStyles} data-testid="epic=buttons">
            <PrimaryCtaButton cta={cta} tracking={tracking} countryCode={countryCode} />

            {secondaryCta && secondaryCta.baseUrl && secondaryCta.text ? (
                <div className={buttonMargins}>
                    <Button onClickAction={secondaryCta.baseUrl} showArrow priority="secondary">
                        {secondaryCta.text}
                    </Button>
                </div>
            ) : (
                showReminderFields && (
                    <div className={buttonMargins}>
                        <Button onClickAction={onOpenReminderClick} isTertiary>
                            {showReminderFields.reminderCTA}
                        </Button>
                    </div>
                )
            )}

            <img
                src="https://assets.guim.co.uk/images/acquisitions/2db3a266287f452355b68d4240df8087/payment-methods.png"
                alt="Accepted payment methods: Visa, Mastercard, American Express and PayPal"
                className={paymentImageStyles}
            />
        </div>
    );
};
