import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { Stack, Container } from '@guardian/src-layout';

const contentContainer = css`
    background-color: #dddbd1;
    padding-top: ${space[1]}px;
    padding-bottom: ${space[5]}px;
`;

export interface ContributionsTemplateWithVisualProps {
    header: React.ReactElement;
    body: React.ReactElement;
    cta: React.ReactElement;
}

const ContributionsTemplateWithVisual: React.FC<ContributionsTemplateWithVisualProps> = ({
    header,
    body,
    cta,
}: ContributionsTemplateWithVisualProps) => {
    return (
        <div css={contentContainer}>
            <Container>
                <Stack space={1}>
                    {header}
                    <Stack space={3}>
                        {body}
                        {cta}
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
};

export default ContributionsTemplateWithVisual;
