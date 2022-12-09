import { AfterViewInit, Directive, ElementRef, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { WINDOW } from '../../public-api';

interface EventListenerDescriptor {
    el: Element;
    eventType: 'click';
    callback: EventListenerOrEventListenerObject;
    options?: boolean | EventListenerOptions;
}

@Directive({
    selector: '[qaRouterNavigation]',
})
export class RouterNavigationDirective implements AfterViewInit, OnDestroy {
    private readonly eventListeners: EventListenerDescriptor[] = [];

    constructor(
        private readonly elRef: ElementRef<HTMLElement>,
        private readonly router: Router,
        @Inject(WINDOW) private readonly windowRef: Window,
        @Inject(PLATFORM_ID) private readonly platformId: Object,
    ) {
    }

    public ngAfterViewInit(): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        if (this.elRef.nativeElement.nodeName === 'A') {
            this.setRouterNavigation(this.elRef.nativeElement as HTMLAnchorElement);

            return;
        }

        this.elRef.nativeElement
            .querySelectorAll<HTMLAnchorElement>('a')
            .forEach(link => this.setRouterNavigation(link));
    }

    public ngOnDestroy(): void {
        this.eventListeners.forEach(({ el, eventType, callback, options }) => {
            el.removeEventListener(eventType, callback, options);
        });
    }

    private setRouterNavigation(link: HTMLAnchorElement): void {
        const eventType = 'click';
        const callback: EventListenerOrEventListenerObject = event => {
            if (
                Boolean(link.onclick) ||
                (link.target && link.target !== '_self') ||
                !link.href ||
                link.href.startsWith('javascript:') ||
                this.isExternalLink(link.href)
            ) {
                return;
            }

            event.preventDefault();
            const { href } = event.currentTarget as HTMLAnchorElement;
            const { pathname, search, hash } = new URL(href);
            const normalizedPathname = pathname.length > 1 && pathname.substring(pathname.length - 1) === '/'
                ? pathname.substring(0, pathname.length - 1)
                : pathname;

            this.router.navigateByUrl(`${normalizedPathname}${search}${hash}`);
        };
        const options = false;

        link.addEventListener(eventType, callback, options);

        this.eventListeners.push({
            el: link,
            eventType,
            callback,
            options,
        });
    }

    private isExternalLink(href: string): boolean {
        return new URL(href).host !== this.windowRef.location.host;
    }
}
