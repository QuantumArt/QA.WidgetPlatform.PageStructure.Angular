import { RouteDescriptor } from './routing.service';
import { SiteRedirect, SiteStructure, SiteStructureNode } from '../services';
import { trim } from '../utils';

export function buildRoutes({ root, redirects }: SiteStructure): RouteDescriptor[] {
    const path = '';
    const routes: RouteDescriptor[] = [];

    if (root.children?.length) {
        for (const childNode of root.children) {
            buildRoutesForNode(childNode, path, routes, 9);
        }
    }

    routes.push({
        path,
        pathMatch: 'full',
        data: {
            nodeId: root.id,
            nodeType: root.nodeType,
        },
    });

    if (redirects?.size) {
        processRedirects(routes, redirects);
        fixRedirectChains(routes);
    }

    return routes;
}

function buildRoutesForNode(
    { id, alias, nodeType, children }: SiteStructureNode,
    parentPath: string,
    routes: RouteDescriptor[],
    recursionLimit: number,
): void {
    if (recursionLimit <= 0 || !alias) {
        return;
    }

    const currentNodePath = `${parentPath}${parentPath ? '/' : ''}${alias}`;

    if (children?.length) {
        for (const childNode of children) {
            buildRoutesForNode(childNode, currentNodePath, routes, recursionLimit - 1);
        }
    }

    routes.push({
        path: alias.includes('/') ? alias : currentNodePath,
        pathMatch: 'full',
        data: {
            nodeId: id,
            nodeType,
        },
    });
}

function processRedirects(routes: RouteDescriptor[], redirects: Map<number, SiteRedirect>): void {
    for (const route of routes) {
        const redirect = redirects.get(route.data.nodeId);
        if (redirect == undefined) {
            continue;
        }

        if (redirect.url) {
            const redirectUrl = trim(redirect.url, '/');
            if (routes.some(route => trim(route.path, '/') === redirectUrl)) {
                route.redirectTo = `/${redirectUrl}`;
            } else if (route.data.nodeType === 'redirect_page') {
                route.data.redirectTo = redirect.url;
            }
        } else {
            const targetRoute = routes.find(({ data }) => data.nodeId === redirect.nodeId);
            if (targetRoute != undefined) {
                route.redirectTo = `/${targetRoute.path}`;
            }
        }
    }
}

function fixRedirectChains(routes: RouteDescriptor[]): void {
    for (const redirectRoute of routes.filter(({ redirectTo }) => redirectTo != undefined)) {
        const chain = [redirectRoute];
        walkInRedirects(routes, chain);

        if (chain.length > 2) {
            for (let i = 0; i < chain.length - 1; i++) {
                chain[i].redirectTo = `/${chain[chain.length - 1].path}`;
            }
        }
    }
}

function walkInRedirects(routes: RouteDescriptor[], chain: RouteDescriptor[]): void {
    const lastRedirectTo = trim(chain[chain.length - 1].redirectTo, '/');
    const targetRoute = routes.find(({ path }) => trim(path, '/') === lastRedirectTo);

    if (targetRoute != undefined && !chain.includes(targetRoute)) {
        chain.push(targetRoute);

        if (targetRoute.redirectTo != undefined) {
            walkInRedirects(routes, chain);
        }
    }
}
