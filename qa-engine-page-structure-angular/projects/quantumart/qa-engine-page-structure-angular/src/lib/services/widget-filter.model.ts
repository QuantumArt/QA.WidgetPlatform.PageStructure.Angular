import { WidgetDetailsApiModel } from '../services';
import { trim } from '../utils';
import { WildcardMatcher } from './wildcard-matcher.model';

export class WidgetFilter {
    public matchByPath(widget: WidgetDetailsApiModel, path: string): boolean {
        const preparedPath = trim(path, '/');

        if (
            (widget.allowedUrlPatterns == null || widget.allowedUrlPatterns.length == 0) &&
            (widget.deniedUrlPatterns == null || widget.deniedUrlPatterns.length == 0)
        ) {
            return true;
        }

        if (widget.deniedUrlPatterns != null && widget.deniedUrlPatterns.length > 0) {
            const deniedMatcher = new WildcardMatcher(
                { startsWith: true, endsWith: true },
                widget.deniedUrlPatterns.map(p => trim(p, '/')),
            );

            if (deniedMatcher.Match(preparedPath).length > 0) {
                return false;
            }
        }

        if (widget.allowedUrlPatterns != null && widget.allowedUrlPatterns.length > 0) {
            const allowedMatcher = new WildcardMatcher(
                { startsWith: true, endsWith: true },
                widget.allowedUrlPatterns.map(p => trim(p, '/')),
            );

            return allowedMatcher.Match(preparedPath).length > 0;
        }

        return true;
    }
}
