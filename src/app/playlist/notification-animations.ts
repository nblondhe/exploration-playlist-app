import {
    AnimationTriggerMetadata,
    trigger,
    state,
    transition,
    style,
    animate,
} from '@angular/animations';

export const notificationAnimations: {
    readonly fadeNotif: AnimationTriggerMetadata;
} = {
    fadeNotif: trigger('fadeAnimation', [
        state('in', style({ opacity: 1 })),
        transition('void => *', [style({ opacity: 0 }), animate('{{ fadeIn }}ms')]),
        transition(
            'default => closing',
            animate('{{ fadeOut }}ms', style({ opacity: 0 })),
        ),
    ]),
};

export type NotifAnimationState = 'default' | 'closing';
