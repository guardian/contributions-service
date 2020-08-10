const ERR_INVALID_COOKIE_NAME = `Cookie must not contain invalid characters (space, tab and the following characters: '()<>@,;"/[]?={}')`;

// subset of https://github.com/guzzle/guzzle/pull/1131
const isValidCookieValue = (name: string): boolean => !/[()<>@,;"\\/[\]?={} \t]/g.test(name);

const getShortDomain = (isCrossSubdomain = false): string => {
    const domain = document.domain || '';

    if (domain === 'localhost') {
        return domain;
    }

    // Trim any possible subdomain (will be shared with supporter, identity, etc)
    if (isCrossSubdomain) {
        return ['', ...domain.split('.').slice(-2)].join('.');
    }
    // Trim subdomains for prod (www.theguardian), code (m.code.dev-theguardian) and dev (dev.theguardian, m.thegulocal)
    return domain.replace(/^(www|m\.code|dev|m)\./, '.');
};

const getDomainAttribute = (isCrossSubdomain = false): string => {
    const shortDomain = getShortDomain(isCrossSubdomain);
    return shortDomain === 'localhost' ? '' : ` domain=${shortDomain};`;
};

export const addCookie = (
    name: string,
    value: string,
    daysToLive?: number,
    isCrossSubdomain: boolean = false,
): void => {
    const expires = new Date();

    if (!isValidCookieValue(name) || !isValidCookieValue(value)) {
        throw new Error(`${ERR_INVALID_COOKIE_NAME} .${name}=${value}`);
    }

    if (daysToLive) {
        expires.setDate(expires.getDate() + daysToLive);
    } else {
        expires.setMonth(expires.getMonth() + 5);
        expires.setDate(1);
    }

    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()};${getDomainAttribute(
        isCrossSubdomain,
    )}`;
};