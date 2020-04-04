import {
    trigger,
    transition,
    style,
    query,
    group,
    animate,
    AnimationTriggerMetadata,
    state,
  } from '@angular/animations';

const optional = { optional: true };

// Router Animation
const navRight = [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: '0',
        right: '0',
        width: '100%',
      })
    ], optional),
    query(':enter', [
      style({ right: '-100%',  })
    ]),
    group([
      query(':leave', [
        animate('500ms ease', style({ right: '100%', }))
      ], optional),
      query(':enter', [
        animate('500ms ease', style({ right: '0%'}))
      ])
    ]),
  ];
  const navLeft = [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
      })
    ], optional),
    query(':enter', [
      style({ left: '-100%',  })
    ]),
    group([
      query(':leave', [
        animate('500ms ease', style({ left: '100%', }))
      ], optional),
      query(':enter', [
        animate('500ms ease', style({ left: '0%'}))
      ])
    ]),
  ];

  export const slider =
  trigger('routeAnimations', [
    transition('About => Home', navLeft ),
    transition('Home => About', navRight ),
  ]);


// Notifications Fade
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

// Dropdown slide
export const dropdownAnimation = [
  trigger('dropdownSlide', [
      state('in', style({
          'max-height': '500px',
          'display': 'flex',
      })),
      state('out', style({
          'max-height': '0px',
          'display': 'flex'
      })),
      transition('in => out', [group([
          animate('200ms ease-in-out', style({
              'max-height': '0px'
          })),
      ]
      )]),
      transition('out => in', [group([
          animate('100ms ease-in-out', style({
              'max-height': '500px'
          })),
      ]
      )])
  ]),
];

export const expansionArrow =
  trigger('expansionArrowRotate', [
    state('default', style({ transform: 'rotate(0)' })),
    state('rotated', style({ transform: 'rotate(-180deg)' })),
    transition('rotated => default', animate('200ms ease-out')),
    transition('default => rotated', animate('200ms ease-in'))
  ]);

  // export const playlistAction =
  // trigger('playlistActionFade', [
  //   state('in', style({opacity: 1})),
  //   transition(':enter', [
  //     style({opacity: 0}),
  //     animate(200 )
  //   ]),
  //   transition(':leave',
  //     animate(200, style({opacity: 0})))
  // ]);
