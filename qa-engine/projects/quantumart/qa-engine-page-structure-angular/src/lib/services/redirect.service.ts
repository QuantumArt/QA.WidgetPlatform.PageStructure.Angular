import { Injectable } from '@angular/core';
import { SiteNodeApiModel, SiteRedirect } from './site-structure.service';

@Injectable({
    providedIn: 'root'
})
export class RedirectService {
    public buildRedirectsMap(siteStructure: SiteNodeApiModel): Map<number, SiteRedirect> {
        const redirects = this.buildRedirects(siteStructure);

        return new Map<number, SiteRedirect>(redirects);
    }

    private buildRedirects(node: SiteNodeApiModel): [number, SiteRedirect][] {
        const result: [number, SiteRedirect][] = [];

        if (node.nodeType === 'start_page' &&
            node.details &&
            node.details['mode']?.value === 'Redirect' &&
            node.children?.length
        ) {
            result.push([node.id, { nodeId: node.children[0].id }]);
        } else if (node.nodeType === 'redirect_page' &&
            node.details &&
            node.details['redirectto']?.value
        ) {
            result.push([node.id, { url: node.details['redirectto'].value as string }]);
        }

        if (node.children) {
            for (const childNode of node.children) {
                result.push(...this.buildRedirects(childNode));
            }
        }

        return result;
    }
}
