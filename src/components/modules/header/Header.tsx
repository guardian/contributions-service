import React, { useEffect } from 'react';

import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { brandAlt, brandText } from '@guardian/src-foundations';
import { headline, textSans } from '@guardian/src-foundations/typography';
import { LinkButton, buttonReaderRevenueBrand } from '@guardian/src-button';
import { Link, linkBrand } from '@guardian/src-link';
import { Hide } from '@guardian/src-layout';
import { ThemeProvider } from '@emotion/react';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { HeaderProps } from '../../../types/HeaderTypes';
import { addRegionIdAndTrackingParamsToSupportUrl } from '../../../lib/tracking';
import { HasBeenSeen, useHasBeenSeen } from '../../../hooks/useHasBeenSeen';
import { OphanAction } from '../../../types/OphanTypes';

const messageStyles = (isThankYouMessage: boolean) => css`
    color: ${brandAlt[400]};
    ${headline.xxsmall({ fontWeight: 'bold' })};
    margin-bottom: 3px;

    ${from.desktop} {
        ${headline.xsmall({ fontWeight: 'bold' })}
    }

    ${from.leftCol} {
        ${isThankYouMessage
            ? headline.small({ fontWeight: 'bold' })
            : headline.medium({ fontWeight: 'bold' })}
    }
`;

const supportAgainHeadingStyles = css`
    ${textSans.small({ fontWeight: 'bold' })}
    color: ${brandAlt[400]};
    font-size: 14px;

    ${from.tablet} {
        ${headline.xxsmall({ fontWeight: 'bold' })};
    }

    ${from.desktop} {
        ${headline.xsmall({ fontWeight: 'bold' })}
    }

    ${from.leftCol} {
        ${headline.small({ fontWeight: 'bold' })}
    }
`;

const supportAgainSubheadingStyles = css`
    ${textSans.medium()};
    color: ${brandText.primary};
`;

const supportAgainLinkStyles = css`
    font-size: 12px;
`;

const supportAgainButtonStyles = css`
    margin-top: ${space[2]}px;
`;

const linkStyles = css`
    height: 32px;
    min-height: 32px;
    ${textSans.small({ fontWeight: 'bold' })};
    border-radius: 16px;
    padding: 0 12px 0 12px;
    line-height: 18px;
    margin-right: 10px;
    margin-bottom: 6px;

    svg {
        width: 24px;
    }
`;

const subMessageStyles = css`
    color: ${brandText.primary};
    ${textSans.medium()};
    margin: 5px 0;
`;

export enum HeaderVariant {
    Control,
    SupportAgain,
}

export const getHeader: (variant: HeaderVariant) => React.FC<HeaderProps> = (
    variant: HeaderVariant,
) => (props: HeaderProps) => {
    const { heading, subheading, primaryCta, secondaryCta } = props.content;
    const { abTestName, abTestVariant, componentType, campaignCode } = props.tracking;

    const sendOphanEvent = (action: OphanAction): void =>
        props.submitComponentEvent &&
        props.submitComponentEvent({
            component: {
                componentType,
                id: campaignCode,
                campaignCode,
            },
            action,
            abTest: {
                name: abTestName,
                variant: abTestVariant,
            },
        });

    const [hasBeenSeen, setNode] = useHasBeenSeen(
        {
            threshold: 0,
        },
        true,
    ) as HasBeenSeen;

    useEffect(() => {
        if (hasBeenSeen) {
            sendOphanEvent('VIEW');
        }
    }, [hasBeenSeen]);

    useEffect(() => {
        sendOphanEvent('INSERT');
    }, []);

    const addTracking = (baseUrl: string): string =>
        addRegionIdAndTrackingParamsToSupportUrl(baseUrl, props.tracking, props.countryCode);

    return (
        <div ref={setNode}>
            {variant === HeaderVariant.Control ? (
                <Hide below="tablet">
                    <div css={messageStyles(false)}>
                        <span>{heading}</span>
                    </div>

                    <div css={subMessageStyles}>
                        <div>{subheading}</div>
                    </div>
                </Hide>
            ) : (
                <div>
                    <div css={supportAgainHeadingStyles}>{heading}</div>

                    <Hide below="tablet">
                        <div css={supportAgainSubheadingStyles}>{subheading}</div>
                    </Hide>
                </div>
            )}

            {primaryCta && variant === HeaderVariant.Control && (
                <ThemeProvider theme={buttonReaderRevenueBrand}>
                    <Hide below="mobileMedium">
                        <LinkButton
                            priority="primary"
                            href={addTracking(primaryCta.url)}
                            icon={<SvgArrowRightStraight />}
                            iconSide="right"
                            nudgeIcon={true}
                            css={linkStyles}
                        >
                            {primaryCta.text}
                        </LinkButton>
                    </Hide>

                    <Hide above="mobileMedium">
                        <LinkButton
                            priority="primary"
                            href={addTracking(primaryCta.url)}
                            css={linkStyles}
                        >
                            {primaryCta.text}
                        </LinkButton>
                    </Hide>
                </ThemeProvider>
            )}

            {primaryCta && variant === HeaderVariant.SupportAgain && (
                <>
                    <Hide above="tablet">
                        <ThemeProvider theme={linkBrand}>
                            <Link
                                priority="primary"
                                href={addTracking(primaryCta.url)}
                                cssOverrides={supportAgainLinkStyles}
                            >
                                {primaryCta.text}
                            </Link>
                        </ThemeProvider>
                    </Hide>

                    <Hide below="tablet">
                        <ThemeProvider theme={buttonReaderRevenueBrand}>
                            <LinkButton
                                priority="primary"
                                href={addTracking(primaryCta.url)}
                                icon={<SvgArrowRightStraight />}
                                iconSide="right"
                                nudgeIcon={true}
                                size="xsmall"
                                cssOverrides={supportAgainButtonStyles}
                            >
                                {primaryCta.text}
                            </LinkButton>
                        </ThemeProvider>
                    </Hide>
                </>
            )}

            {secondaryCta && (
                <Hide below="tablet">
                    <ThemeProvider theme={buttonReaderRevenueBrand}>
                        <LinkButton
                            priority="primary"
                            href={addTracking(secondaryCta.url)}
                            icon={<SvgArrowRightStraight />}
                            iconSide="right"
                            nudgeIcon={true}
                            css={linkStyles}
                        >
                            {secondaryCta.text}
                        </LinkButton>
                    </ThemeProvider>
                </Hide>
            )}
        </div>
    );
};

export const Header = getHeader(HeaderVariant.Control);
