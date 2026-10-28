export const connections = ['current-resident', 'former-resident', 'worked-here', 'historic-event'] as const;

export type Connection = (typeof connections)[number];

export const connectionInfo: Record<Connection, { label: string; plural: string; blurb: string }> = {
  'current-resident': {
    label: 'Current resident',
    plural: 'Current residents',
    blurb: 'People who live in the neighborhood now.',
  },
  'former-resident': {
    label: 'Former resident',
    plural: 'Former residents',
    blurb: 'People who lived here and later left.',
  },
  'worked-here': {
    label: 'Worked here',
    plural: 'Worked here',
    blurb: 'People connected by work they did here.',
  },
  'historic-event': {
    label: 'Historic event',
    plural: 'Historic events',
    blurb: 'Events that took place in the neighborhood.',
  },
};
