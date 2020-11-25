import React from 'react';
import { ArticleCountOptOut } from '../components/modules/shared/ArticleCountOptOut';
import { ArticleCountOptOutType } from '../components/modules/shared/ArticleCountOptOut';

export const replaceArticleCount = (
    text: string,
    numArticles: number,
    articleCountOptOutType: ArticleCountOptOutType,
): Array<JSX.Element> => {
    const nextWords: Array<string | null> = [];
    const subbedText = text.replace(/%%ARTICLE_COUNT%%( \w+)?/g, (_, nextWord) => {
        nextWords.push(nextWord);
        return '%%ARTICLE_COUNT_AND_NEXT_WORD%%';
    });

    const parts = subbedText.split(/%%ARTICLE_COUNT_AND_NEXT_WORD%%/);
    const elements = [];
    for (let i = 0; i < parts.length - 1; i += 1) {
        elements.push(<span dangerouslySetInnerHTML={{ __html: parts[i] }} />);
        elements.push(
            <ArticleCountOptOut
                numArticles={numArticles}
                nextWord={nextWords[i]}
                type={articleCountOptOutType}
            />,
        );
    }
    elements.push(<span dangerouslySetInnerHTML={{ __html: parts[parts.length - 1] }} />);

    return elements;
};
