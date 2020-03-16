import React from 'react';
import { css } from 'emotion';
import { body, headline } from '@guardian/src-foundations/typography';
import { palette } from '@guardian/src-foundations';
import { space } from '@guardian/src-foundations';
import { PrimaryButton } from './PrimaryButton';
import { getTrackingUrl } from '../lib/tracking';
import { getCountryName, getLocalCurrencySymbol } from '../lib/geolocation';
import { EpicLocalisation, EpicTracking } from './ContributionsEpicTypes';
import { Variant } from '../lib/variants';

const replacePlaceholders = (content: string, countryCode?: string): string => {
    // Replace currency symbol placeholder with actual currency symbol
    // Function uses default currency symbol so countryCode is not strictly required here
    content = content.replace(/%%CURRENCY_SYMBOL%%/g, getLocalCurrencySymbol(countryCode));

    // Replace country code placeholder with actual country name
    // Should only replace if we were able to determine the country name from country code
    const countryName = getCountryName(countryCode) ?? '';
    content = countryName ? content.replace(/%%COUNTRY_CODE%%/g, countryName) : content;

    return content;
};

// Spacing values below are multiples of 4.
// See https://www.theguardian.design/2a1e5182b/p/449bd5
const wrapperStyles = css`
    padding: ${space[1]}px ${space[1]}px ${space[3]}px;
    border-top: 1px solid ${palette.brandAlt[400]};
    background-color: ${palette.neutral[97]};

    * {
        ::selection {
            background: ${palette.brandAlt[400]};
        }
        ::-moz-selection {
            background: ${palette.brandAlt[400]};
        }
    }
`;

const headingStyles = css`
    ${headline.xxsmall({ fontWeight: 'bold' })}
    margin-top: 0;
    margin-bottom: ${space[3]}px;
`;

const bodyStyles = css`
    margin: 0 auto ${space[2]}px;
    ${body.medium()};
`;

const highlightWrapperStyles = css`
    ${body.medium({ fontWeight: 'bold' })}
`;

const highlightStyles = css`
    padding: 2px;
    background-color: ${palette.brandAlt[400]};
`;

const buttonWrapperStyles = css`
    margin: ${space[6]}px ${space[2]}px ${space[1]}px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`;

const imageStyles = css`
    display: inline-block;
    width: auto;
    height: 25px;
    margin: ${space[1]}px 0;
`;

export type Props = {
    variant: Variant;
    tracking: EpicTracking;
    localisation: EpicLocalisation;
};

type HighlightedProps = {
    highlightedText: string;
    countryCode?: string;
};

type BodyProps = {
    variant: Variant;
    countryCode?: string;
};

const Highlighted: React.FC<HighlightedProps> = ({
    highlightedText,
    countryCode,
}: HighlightedProps) => (
    <strong className={highlightWrapperStyles}>
        {' '}
        <span
            className={highlightStyles}
            dangerouslySetInnerHTML={{
                __html: replacePlaceholders(highlightedText, countryCode),
            }}
        />
    </strong>
);

const EpicBody: React.FC<BodyProps> = ({ variant, countryCode }: BodyProps) => {
    const { paragraphs, highlightedText } = variant;

    return (
        <>
            {paragraphs.map((paragraph, idx) => (
                <p key={idx} className={bodyStyles}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: replacePlaceholders(paragraph, countryCode),
                        }}
                    />

                    {highlightedText && idx === paragraphs.length - 1 && (
                        <Highlighted highlightedText={highlightedText} countryCode={countryCode} />
                    )}
                </p>
            ))}
        </>
    );
};

export const ContributionsEpic: React.FC<Props> = ({ variant, tracking, localisation }: Props) => {
    const { heading } = variant;
    const { countryCode } = localisation;

    // Get button URL with tracking params in query string
    const buttonBaseUrl = 'https://support.theguardian.com/uk/contribute';
    const buttonTrackingUrl = getTrackingUrl(buttonBaseUrl, tracking);

    return (
        <section className={wrapperStyles}>
            {heading && (
                <h2
                    className={headingStyles}
                    dangerouslySetInnerHTML={{ __html: replacePlaceholders(heading, countryCode) }}
                />
            )}

            <EpicBody variant={variant} countryCode={countryCode} />

            <div className={buttonWrapperStyles}>
                <PrimaryButton url={buttonTrackingUrl} linkText="Support The Guardian" />
                <img
                    src="https://assets.guim.co.uk/images/acquisitions/2db3a266287f452355b68d4240df8087/payment-methods.png"
                    alt="Accepted payment methods: Visa, Mastercard, American Express and PayPal"
                    className={imageStyles}
                />
            </div>
        </section>
    );
};
