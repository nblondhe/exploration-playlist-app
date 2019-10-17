import {
    trigger,
    transition,
    style,
    query,
    group,
    animate,
  } from '@angular/animations';

const optional = { optional: true };

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
        animate('600ms ease', style({ right: '100%', }))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ right: '0%'}))
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
      style({ right: '-100%',  })
    ]),
    group([
      query(':leave', [
        animate('600ms ease', style({ left: '100%', }))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ left: '0%'}))
      ])
    ]),
  ];

  export const slider =
  trigger('routeAnimations', [
    transition('* => isLeft', navLeft ),
    transition('* => isRight', navRight ),
    transition('isRight => *', navLeft ),
    transition('isLeft => *', navRight )
  ]);
