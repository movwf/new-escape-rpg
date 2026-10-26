import Map01 from '../data/maps/01.json';

/*
  Map settings

*/

// eslint-disable-next-line import/prefer-default-export
export const Maps = {
  'map-1': {
    image: 'https://i.ibb.co/gJcWXnZ/boardgame.png',
    data: Map01,
    pathLayerName: 'Fences',
    boards: [
      {
        id: 'garden-notice',
        bounds: { x: 34, y: 0, width: 60, height: 64 },
        title: 'Garden Notice',
        content: [
          'Welcome to the garden.',
          'The main gate is locked. Look around — there may be another way out.',
        ],
      },
      {
        id: 'fountain-notice',
        bounds: { x: 378, y: 0, width: 60, height: 64 },
        title: 'Notice',
        content: [
          'Lost: one brass key.',
          'If found, please leave it by the fountain. Reward offered.',
        ],
      },
    ],
  },
};
