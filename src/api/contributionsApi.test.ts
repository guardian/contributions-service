import { fetchDefaultEpicContent } from './contributionsApi';
import { memoiseAsync } from '../lib/memoise';

jest.mock('node-fetch', () => require('fetch-mock').sandbox());
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require('node-fetch');
fetchMock.config.overwriteRoutes = true;

const epicUrl =
    'https://interactive.guim.co.uk/docsdata/1fy0JolB1bf1IEFLHGHfUYWx-niad7vR9K954OpTOvjE.json';

const epicResponse = {
    sheets: {
        control: [
            {
                heading: 'Since you’re here...',
                paragraphs: 'First paragraph',
                highlightedText: 'Highlighted Text',
            },
            {
                heading: '',
                paragraphs: 'Second paragraph',
                highlightedText: '',
            },
        ],
    },
};

beforeEach(fetchMock.resetHistory);

describe('fetchDefaultEpic', () => {
    it('fetches and returns the data in the expected format', async () => {
        fetchMock.get(epicUrl, epicResponse);

        const [reset, fetchData] = memoiseAsync(fetchDefaultEpicContent);
        reset();

        const epicData = await fetchData();

        expect(epicData).toEqual({
            heading: 'Since you’re here...',
            paragraphs: ['First paragraph', 'Second paragraph'],
            highlighted: ['Highlighted Text'],
        });
    });

    it('caches successful epic fetches', async () => {
        fetchMock.get(epicUrl, epicResponse);

        const [reset, fetchData] = memoiseAsync(fetchDefaultEpicContent);
        reset();

        await fetchData();
        await fetchData();

        expect(fetchMock.calls().length).toEqual(1);
    });

    it('does not cache unsuccessful epic fetches', async () => {
        fetchMock.get(epicUrl, { status: 500 });

        const [reset, fetchData] = memoiseAsync(fetchDefaultEpicContent);
        reset();

        try {
            await fetchData();
        } catch {}
        try {
            await fetchData();
        } catch {}

        expect(fetchMock.calls().length).toEqual(2);
    });
});
