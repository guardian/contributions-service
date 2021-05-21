// --- Imports --- //

import React, { useState } from 'react';
import { body, textSans } from '@guardian/src-foundations/typography';
import { palette, space } from '@guardian/src-foundations';
import { Button } from '@guardian/src-button';
import { ButtonLink } from '@guardian/src-link';
import { css } from '@emotion/core';
import { OphanComponentEvent } from '../../../types/OphanTypes';
import {
    OPHAN_COMPONENT_ARTICLE_COUNT_OPT_OUT_OPEN,
    OPHAN_COMPONENT_ARTICLE_COUNT_OPT_OUT_CLOSE,
    OPHAN_COMPONENT_ARTICLE_COUNT_STAY_IN,
    OPHAN_COMPONENT_ARTICLE_COUNT_OPT_OUT,
    OPHAN_COMPONENT_ARTICLE_COUNT_STAY_OUT,
    OPHAN_COMPONENT_ARTICLE_COUNT_OPT_IN,
} from './utils/ophan';

// --- Styles --- //

const containerStyles = css`
    ${body.medium({ fontWeight: 'bold' })};
    font-style: italic;
`;

const optOutContainer = css`
    color: ${palette.opinion[400]};
`;

const articleCountOnHeaderContainerStyles = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const articleCountTextStyles = css`
    ${textSans.small()};
    margin-right: ${space[1]}px;
`;

const articleCountWrapperStyles = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: ${space[2]}px;
    justify-content: flex-end;
`;

const articleCountCtaStyles = css`
    ${textSans.small({ fontWeight: 'bold' })};
`;

const articleCountDescriptionTopContainerStyles = css`
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
    margin-top: ${space[4]}px;
    position: relative;
`;

const articleCountDescriptionContainer = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${space[3]}px 0;
`;

const articleCountBodyTextStyles = css`
    ${textSans.small()};
    width: 65%;
`;

const articleCountCtasContainerStyles = css`
    display: flex;
    flex-direction: column;
    margin-left: auto;
    justify-content: space-between;
    height: 60px;
`;

const articleCountOptInCtaStyles = css`
    background-color: #000000;
`;

const articleCountDefaultCtaStyles = css`
    background-color: #000000;
    padding-left: 20px;
`;

const articleCountOptOutCtaStyles = css`
    color: #000000;
    border: 1px solid #000000;
`;

const trackingSettingsContainerStyles = css`
    ${textSans.xsmall()};
    margin: ${space[4]}px auto;
    margin-bottom: ${space[2]}px;
`;

const privacySettingsLinkStyles = css`
    ${textSans.xsmall({ fontWeight: 'bold' })};
`;

const caretStyles = css`
    &:before {
        content: '';
        display: block;
        position: absolute;
        right: 8px;
        bottom: 100%;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom-color: black;
    }
    &:after {
        content: '';
        display: block;
        position: absolute;
        right: 9px;
        bottom: 100%;
        width: 0;
        height: 0;
        border: 9px solid transparent;
        border-bottom-color: ${palette.neutral[97]};
    }
`;

interface Props {
    numArticles: number;
}

export interface ContributionsEpicArticleCountOptOutProps {
    numArticles: number;
    isArticleCountOn: boolean;
    onArticleCountOptOut: () => void;
    onArticleCountOptIn: () => void;
    openCmp?: () => void;
    submitComponentEvent?: (componentEvent: OphanComponentEvent) => void;
}

// -- Components -- //

export const ContributionsEpicArticleCountAbove: React.FC<Props> = ({ numArticles }: Props) => {
    return (
        <div css={containerStyles}>
            You&apos;ve read <span css={optOutContainer}>{numArticles} articles</span> in the last
            year
        </div>
    );
};

export const ContributionsEpicArticleCountOptOut: React.FC<ContributionsEpicArticleCountOptOutProps> = ({
    numArticles,
    isArticleCountOn,
    onArticleCountOptOut,
    onArticleCountOptIn,
    openCmp,
    submitComponentEvent,
}: ContributionsEpicArticleCountOptOutProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const onToggleClick = () => {
        setIsOpen(!isOpen);
        submitComponentEvent &&
            submitComponentEvent(
                isOpen
                    ? OPHAN_COMPONENT_ARTICLE_COUNT_OPT_OUT_CLOSE
                    : OPHAN_COMPONENT_ARTICLE_COUNT_OPT_OUT_OPEN,
            );
    };

    const onStayInClick = () => {
        setIsOpen(false);
        submitComponentEvent && submitComponentEvent(OPHAN_COMPONENT_ARTICLE_COUNT_STAY_IN);
    };

    const onOptOutClick = () => {
        setIsOpen(false);
        onArticleCountOptOut();
        submitComponentEvent && submitComponentEvent(OPHAN_COMPONENT_ARTICLE_COUNT_OPT_OUT);
    };

    const onOptInClick = () => {
        setIsOpen(false);
        onArticleCountOptIn();
        submitComponentEvent && submitComponentEvent(OPHAN_COMPONENT_ARTICLE_COUNT_OPT_IN);
    };

    const onStayOutClick = () => {
        setIsOpen(false);
        submitComponentEvent && submitComponentEvent(OPHAN_COMPONENT_ARTICLE_COUNT_STAY_OUT);
    };

    return (
        <>
            {isArticleCountOn ? (
                <div css={articleCountOnHeaderContainerStyles}>
                    <ContributionsEpicArticleCountAbove numArticles={numArticles} />
                    <div css={articleCountWrapperStyles}>
                        <div css={articleCountTextStyles}>Article count</div>
                        <ButtonLink
                            priority="secondary"
                            onClick={onToggleClick}
                            cssOverrides={articleCountCtaStyles}
                        >
                            on
                        </ButtonLink>
                    </div>
                </div>
            ) : (
                <div css={articleCountWrapperStyles}>
                    <div css={articleCountTextStyles}>Article count</div>
                    <ButtonLink
                        priority="secondary"
                        onClick={onToggleClick}
                        cssOverrides={articleCountCtaStyles}
                    >
                        off
                    </ButtonLink>
                </div>
            )}
            {isOpen && (
                <div css={articleCountDescriptionTopContainerStyles}>
                    <div css={caretStyles}></div>
                    <div css={articleCountDescriptionContainer}>
                        {isArticleCountOn ? (
                            <>
                                <div css={articleCountBodyTextStyles}>
                                    We are counting the number of Guardian articles you&apos;ve read
                                    on this browser. Can we continue showing your article count?
                                </div>
                                <div css={articleCountCtasContainerStyles}>
                                    <Button
                                        priority="primary"
                                        size="xsmall"
                                        cssOverrides={articleCountDefaultCtaStyles}
                                        onClick={onStayInClick}
                                    >
                                        Yes, thats OK
                                    </Button>
                                    <Button
                                        priority="tertiary"
                                        size="xsmall"
                                        cssOverrides={articleCountOptOutCtaStyles}
                                        onClick={onOptOutClick}
                                    >
                                        No, opt me out
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div css={articleCountBodyTextStyles}>
                                    We are no longer counting the number of Guardian articles
                                    you&apos;ve read on this browser. Can we start showing your
                                    article count?
                                </div>
                                <div css={articleCountCtasContainerStyles}>
                                    <Button
                                        priority="primary"
                                        size="xsmall"
                                        cssOverrides={articleCountOptInCtaStyles}
                                        onClick={onOptInClick}
                                    >
                                        Yes, opt me in
                                    </Button>
                                    <Button
                                        priority="tertiary"
                                        size="xsmall"
                                        cssOverrides={articleCountOptOutCtaStyles}
                                        onClick={onStayOutClick}
                                    >
                                        No, thank you
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                    <div css={trackingSettingsContainerStyles}>
                        To opt out of other tracking activity, manage your{' '}
                        <ButtonLink
                            priority="secondary"
                            cssOverrides={privacySettingsLinkStyles}
                            onClick={openCmp}
                        >
                            Privacy Settings
                        </ButtonLink>
                    </div>
                </div>
            )}
        </>
    );
};