import { HandCoins, Repeat2, Gift, Wrench } from 'lucide-react';

// UI labels and styling for listing types (presentation only — data comes from the API).
export const TYPE_META = {
  sell: {
    label: 'Sell',
    verb: 'Sell it',
    pill: 'bg-forest-100 text-forest-700',
    dot: 'bg-forest-700',
    icon: HandCoins,
    blurb: 'Set a fair price and pass it on.',
  },
  swap: {
    label: 'Swap',
    verb: 'Swap it',
    pill: 'bg-swap-100 text-swap',
    dot: 'bg-swap',
    icon: Repeat2,
    blurb: 'Trade for something you actually need.',
  },
  donate: {
    label: 'Donate',
    verb: 'Donate it',
    pill: 'bg-marigold-100 text-[#8A5A12]',
    dot: 'bg-marigold',
    icon: Gift,
    blurb: 'Give it freely to someone nearby.',
  },
  repair: {
    label: 'Repair',
    verb: 'Get it repaired',
    pill: 'bg-repair-100 text-repair',
    dot: 'bg-repair',
    icon: Wrench,
    blurb: 'Find a fixer and keep it going.',
  },
};

export const BAND_COLOR = {
  Excellent: '#1E5A43',
  Good: '#3C7D61',
  Moderate: '#B7791F',
  Low: '#B42318',
};
