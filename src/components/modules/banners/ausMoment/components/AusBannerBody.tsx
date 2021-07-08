import React from 'react';
import { css } from '@emotion/core';
import { body, headline } from '@guardian/src-foundations/typography';
import { neutral } from '@guardian/src-foundations/palette';
import { Hide } from '@guardian/src-layout';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { BannerTextContent } from '../../common/types';

const containerStyles = css`
    ${body.small({ fontWeight: 'bold' })}
    color: ${neutral[100]};
`;

const desktopContainerStyles = css`
    > * + * {
        margin-top: ${space[2]}px;
    }
`;

interface AusBannerBodyProps {
    content: BannerTextContent;
}

const AusBannerBody: React.FC<AusBannerBodyProps> = ({ content }: AusBannerBodyProps) => {
    return (
        <div css={containerStyles}>
            <Hide above="tablet">
                {content.mobileContent?.messageText ?? content.mainContent.messageText}
            </Hide>
            <Hide below="tablet">
                <div css={desktopContainerStyles}>
                    <div>{content.mainContent.messageText}</div>
                </div>
            </Hide>
        </div>
    );
};

export default AusBannerBody;
