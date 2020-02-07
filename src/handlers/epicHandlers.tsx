import { Request, Response, NextFunction } from 'express';
import { Validator } from 'jsonschema';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { extractCritical } from 'emotion-server';

import { renderHtmlDocument } from '../utils/renderHtmlDocument';
import testData from '../components/ContributionsEpic.testData';
import {
    ContributionsEpic,
    EpicTracking,
    EpicLocalisation,
    EpicTargeting,
} from '../components/ContributionsEpic';
import { shouldRenderEpic } from '../lib/targeting';
import { fetchDefaultEpicContent } from '../api/contributionsApi';

interface Epic {
    html: string;
    css: string;
}

class ValidationError extends Error {}

const schemaPath = path.join(__dirname, '..', 'schemas', 'epicPayload.schema.json');
const epicPayloadSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Return the HTML and CSS from rendering the Epic to static markup
const buildEpic = async (
    tracking: EpicTracking,
    localisation: EpicLocalisation,
    targeting: EpicTargeting,
): Promise<Epic | null> => {
    const { heading, paragraphs, highlighted } = await fetchDefaultEpicContent();
    const content = {
        heading,
        paragraphs,
        highlighted,
    };

    // Determine whether to render the Epic or return empty HTML and CSS
    if (shouldRenderEpic(targeting)) {
        const { html, css } = extractCritical(
            renderToStaticMarkup(
                <ContributionsEpic
                    content={content}
                    tracking={tracking}
                    localisation={localisation}
                />,
            ),
        );
        return { html, css };
    }

    return null;
};

// Return a metadata object safe to be consumed by the Epic component
const buildTracking = (req: Request): EpicTracking => {
    const {
        ophanPageId,
        ophanComponentId,
        platformId,
        campaignCode,
        abTestName,
        abTestVariant,
        referrerUrl,
    } = req.body.tracking;

    return {
        ophanPageId,
        ophanComponentId,
        platformId,
        campaignCode,
        abTestName,
        abTestVariant,
        referrerUrl,
    };
};

const buildLocalisation = (req: Request): EpicLocalisation => {
    const { countryCode } = req.body.localisation;
    return { countryCode };
};

const buildTargeting = (req: Request): EpicTargeting => {
    const {
        contentType,
        sectionName,
        shouldHideReaderRevenue,
        isMinuteArticle,
        isPaidContent,
        tags,
    } = req.body.targeting;

    return {
        contentType,
        sectionName,
        shouldHideReaderRevenue,
        isMinuteArticle,
        isPaidContent,
        tags,
    };
};
const epicPostHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validator = new Validator();
        const validation = validator.validate(req.body, epicPayloadSchema);

        if (!validation.valid) {
            throw new ValidationError(validation.toString());
        }

        const tracking = buildTracking(req);
        const localisation = buildLocalisation(req);
        const targeting = buildTargeting(req);

        const epic = await buildEpic(tracking, localisation, targeting);
        res.send({ data: epic });
    } catch (error) {
        next(error);
    }
};

const epicGetHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { tracking, localisation, targeting } = testData;
        const epic = await buildEpic(tracking, localisation, targeting);
        const { html, css } = epic ?? { html: '', css: '' };
        const htmlContent = renderHtmlDocument({ html, css });
        res.send(htmlContent);
    } catch (error) {
        next(error);
    }
};

export { epicPostHandler, epicGetHandler, ValidationError };
