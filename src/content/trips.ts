// Words for the trips beyond Paris (game-systems §31).
export interface RideText {
  name: string;
  /** What the big button says. */
  go: string;
  how: string;
}

export const ATTRACTION_TEXT: Record<string, { name: string; place: string; gate: string; back: 'paris' | 'newyork'; backLabel: string }> =
  {
    storybook: {
      name: 'Storybook Kingdom',
      place: 'A sparkle train from Paris',
      gate: 'A day pass lets you ride everything and watch the castle light up at night.',
      back: 'paris',
      backLabel: 'Back to Paris',
    },
    funfair: {
      name: 'Boardwalk Funfair',
      place: 'A ferry ride from New York',
      gate: 'A day pass lets you ride everything on the seaside boardwalk.',
      back: 'newyork',
      backLabel: 'Back to New York',
    },
  };

export const RIDE_TEXT: Record<string, RideText> = {
  'storybook.carousel': { name: 'Carousel', go: 'Grab the ring!', how: 'Tap when the brass ring is in the glowing spot.' },
  'storybook.fireworks': { name: 'Fireworks', go: 'Fireworks', how: 'Watch the rockets, then launch them in the same order.' },
  'storybook.fountain': { name: 'Fountain', go: 'Fountain', how: 'Pick a coin, toss it in and make a wish.' },
  'funfair.wheel': { name: 'Big Wheel', go: 'Snap the photo!', how: 'Tap when your gondola reaches the glowing window at the top.' },
  'funfair.bell': { name: 'Strong Bell', go: 'Ring it!', how: 'Tap when the puck is in the glowing band to ring the bell.' },
  'funfair.neon': { name: 'Neon Lights', go: 'Neon Lights', how: 'Watch the neon lights, then switch them on in the same order.' },
};

export const WISHES = ['A new best friend', 'A big adventure', 'A sunny day'];
export const LIGHT_COLORS = ['#FF7BA9', '#FFC94A', '#3BB7C4', '#B692F6'];
export const LIGHT_NAMES = ['Pink', 'Yellow', 'Teal', 'Violet'];
export const LIGHT_NOTES = [262, 330, 392, 523];
