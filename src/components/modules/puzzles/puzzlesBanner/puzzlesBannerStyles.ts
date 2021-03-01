import { css } from '@emotion/core';
import { between, from, until } from '@guardian/src-foundations/mq';
import { headline } from '@guardian/src-foundations/typography/cjs';
import { neutral, lifestyle } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

export const banner = css`
    html {
        box-sizing: border-box;
    }
    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }
    strong {
        font-weight: bold;
    }
    box-sizing: border-box;
    width: 100%;
    background-color: ${lifestyle[300]};
    color: ${neutral[100]};
    border: 2px solid ${neutral[0]};

    ${until.tablet} {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
`;

export const bannerContents = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${from.tablet} {
        flex-direction: row;
        min-height: 290px;
    }

    ${from.desktop} {
        height: 344px;
    }
`;

export const squaresContainer = css`
    display: flex;
    justify-content: flex-end;
    height: 100%;
    position: relative;
    width: 100%;
    max-width: 750px;
    padding-right: 44px;
`;

export const headingSection = css`
    max-width: 500px;
    margin-right: ${space[6]}px;
`;

export const heading = css`
    ${headline.large({ fontWeight: 'bold' })};
    margin: 0 0 ${space[6]}px;

    ${between.tablet.and.desktop} {
        ${headline.small({ fontWeight: 'bold' })}
    }

    ${from.leftCol} {
        font-size: 66px;
    }
`;

export const buttonContainer = css`
    display: flex;
    flex-direction: column;

    a {
        margin-bottom: ${space[2]}px;
    }

    ${from.leftCol} {
        flex-direction: row;

        a:not(:last-of-type) {
            margin-right: ${space[4]}px;
        }
    }
`;

export const collapseButton = css`
    border: none;
    background-color: ${neutral[97]};
    color: ${neutral[7]};
    align-self: flex-end;

    &:hover {
        background-color: ${neutral[7]};
        color: ${neutral[97]};
    }
`;

export const collapseButtonContainer = css`
    & > * {
        padding: ${space[2]}px;
        justify-content: flex-end;
    }
`;
