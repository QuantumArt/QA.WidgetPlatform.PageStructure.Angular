export interface WildcardMatchingOption {
    startsWith?: boolean;
    endsWith?: boolean;
    caseSensitive?: boolean;
}

export class WildcardMatcher {
    private readonly dictionary: Map<string, RegExp>;

    constructor(private readonly options: WildcardMatchingOption, patterns: string[]) {
        this.dictionary = new Map<string, RegExp>();

        new Set<string>(patterns).forEach(pattern => {
            this.dictionary.set(pattern, this.prepareExpression(pattern));
        });
    }

    public Match(text: string): string[] {
        const result = [];

        for (const [key, value] of this.dictionary) {
            if (value.test(text)) {
                result.push(key);
            }
        }

        return result;
    }

    private prepareExpression(pattern: string): RegExp {
        let escaped = '';

        if (this.options.startsWith) {
            escaped = `^${escaped}`;
        }

        const placeholder = '__fake_123_';
        escaped += this.escapeRegExp(pattern.replace('*', placeholder)).replace(placeholder, '[\\w+-_]*');

        if (this.options.endsWith) {
            escaped += '$';
        }

        return new RegExp(escaped, this.options.caseSensitive ? '' : 'i');
    }

    private escapeRegExp(pattern: string): string {
        return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
