export const GOTO_PARAMETER_KEY = 'goto';

export function buildUrlQueryParameters(url: string, parameters: Record<string, string>): string {
    if (url) {
        const [parsedurl, query] = url.split('?');
        const params = new URLSearchParams(query);

        for (const key in parameters) {
            params.set(key, parameters[key]);
        }

        return `${parsedurl}?${params.toString()}`;
    }

    return '';
}

export function safeDecodeURIComponent(component: string): string {
    try {
        return decodeURIComponent(component);
    } catch {
        return component;
    }
}

export function combine(headUrl: string, tailUrl: string): string {
    const head = !headUrl ? '' : headUrl;
    const tail = !tailUrl ? '' : tailUrl;

    if (!tail) {
        return `${head}`;
    }

    return (
        (head.endsWith('/') ? head.substring(0, head.length - 1) : head) + (tail.startsWith('/') ? tail : `/${tail}`)
    );
}

export function isAbsoluteUrl(url: string): boolean {
    return url.startsWith('https://') || url.startsWith('http://');
}
