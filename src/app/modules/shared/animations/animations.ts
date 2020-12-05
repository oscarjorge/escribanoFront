import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { state } from '@angular/animations';
export const slideIn = trigger('slideIn', [
    state('*', style({
        transform: 'translateX(100%)',
    })),
    state('in', style({
        transform: 'translateX(0)',
    })),
    state('out', style({
        transform: 'translateX(-100%)',
    })),
    transition('* => in', animate('600ms ease-in')),
    transition('in => out', animate('600ms ease-in'))
]);
export const fadeIn = trigger('fadeIn', [
    transition('void => *', [
        // 'From' Style
        style({ opacity: 0, }
        ),
        animate('400ms ease-in',
            // 'To' Style
            style(
                { opacity: 1, }),
        )]),
]);
export const fadeOut = trigger('fadeOut', [
    transition('* => void', [
        // 'From' Style
        style({ opacity: 1, }
        ),
        animate('400ms ease-in',
            // 'To' Style
            style(
                { opacity: 0 }),
        )]),
]);
export const fadeInOut = trigger('fadeInOut', [
    transition('void => *', [
        // 'From' Style
        style({ opacity: 0, }
        ),
        animate('300ms ease-in',
            // 'To' Style
            style(
                { opacity: 1, }),
        )]),
    transition('* => void', [
        // 'From' Style
        style({ opacity: 1 }),
        animate('300ms ease-in',
            // 'To' Style
            style({ opacity: 0, }),
        )])
]);
export const rotatedState = trigger('rotatedState', [
    state('default', style({ transform: 'rotate(0)' })),
    state('rotated', style({ transform: 'rotate(-180deg)' })),
    transition('rotated => default', animate('500ms ease-out')),
    transition('default => rotated', animate('500ms ease-in'))
])

export const favoriteState = trigger('favoriteState', [
    state('default', style({ opacity: .5, color: 'gray'})),
    state('favorite', style({ opacity: 1})),
    transition('favorite => default',  animate('500ms ease-out')
    ),
    transition('default => favorite', animate('500ms ease-out')
    )
])

export const collapseCardState = trigger('collapseCardState', [
    state('default', style({ 'max-height': '22500px', opacity:1})),
    state('collapse', style({ 'max-height': '0px', opacity: 0, 'z-index':-1, 'display':'none'})),
    transition('collapse => default',  animate('500ms')
    ),
    transition('default => collapse', animate('500ms')
    )
])
export const disabledIconState = trigger('disabledIconState', [
    state('enabled', style({ color: '#3B6137' })),
    state('disabled', style({ color: '#c8c1bc' })),
    transition('disabled => enabled',  animate('500ms')
    ),
    transition('enabled => disabled', animate('500ms')
    )
])
