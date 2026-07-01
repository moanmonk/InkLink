export interface PastelPalette {
  id: string;
  primary: string;      // main hex (e.g. #8E94F2)
  hover: string;        // hover hex
  bgLight: string;      // bg class/hex (e.g. bg-[#8E94F2]/10)
  border: string;       // border style (e.g. border-[#8E94F2]/20)
  text: string;         // text class (e.g. text-[#5C64D6])
  badgeBg: string;      // badge background
  btnClass: string;     // custom button styling
  shadowGlow: string;   // soft shadow color
}

export const PASTEL_PALETTES: { [key: string]: PastelPalette } = {
  lavender: {
    id: 'lavender',
    primary: '#9097F3',
    hover: '#7E86EB',
    bgLight: 'bg-[#9097F3]/8',
    border: 'border-[#9097F3]/25',
    text: 'text-[#616AE0]',
    badgeBg: 'bg-[#9097F3]/12',
    btnClass: 'bg-[#9097F3] hover:bg-[#7E86EB] text-white shadow-[2px_2px_0_rgba(144,151,243,0.15)] hover:shadow-none',
    shadowGlow: 'rgba(144, 151, 243, 0.15)'
  },
  sage: {
    id: 'sage',
    primary: '#88B69E',
    hover: '#76A38B',
    bgLight: 'bg-[#88B69E]/8',
    border: 'border-[#88B69E]/25',
    text: 'text-[#417057]',
    badgeBg: 'bg-[#88B69E]/12',
    btnClass: 'bg-[#88B69E] hover:bg-[#76A38B] text-white shadow-[2px_2px_0_rgba(136,182,158,0.15)] hover:shadow-none',
    shadowGlow: 'rgba(136, 182, 158, 0.15)'
  },
  peach: {
    id: 'peach',
    primary: '#EFA694',
    hover: '#E5917D',
    bgLight: 'bg-[#EFA694]/8',
    border: 'border-[#EFA694]/25',
    text: 'text-[#B85741]',
    badgeBg: 'bg-[#EFA694]/12',
    btnClass: 'bg-[#EFA694] hover:bg-[#E5917D] text-white shadow-[2px_2px_0_rgba(239,166,148,0.15)] hover:shadow-none',
    shadowGlow: 'rgba(239, 166, 148, 0.15)'
  },
  butter: {
    id: 'butter',
    primary: '#E3C57A',
    hover: '#D4B467',
    bgLight: 'bg-[#E3C57A]/8',
    border: 'border-[#E3C57A]/25',
    text: 'text-[#8F7124]',
    badgeBg: 'bg-[#E3C57A]/12',
    btnClass: 'bg-[#E3C57A] hover:bg-[#D4B467] text-white shadow-[2px_2px_0_rgba(227,197,122,0.15)] hover:shadow-none',
    shadowGlow: 'rgba(227, 197, 122, 0.15)'
  },
  rose: {
    id: 'rose',
    primary: '#EE98AD',
    hover: '#E08197',
    bgLight: 'bg-[#EE98AD]/8',
    border: 'border-[#EE98AD]/25',
    text: 'text-[#B2455D]',
    badgeBg: 'bg-[#EE98AD]/12',
    btnClass: 'bg-[#EE98AD] hover:bg-[#E08197] text-white shadow-[2px_2px_0_rgba(238,152,173,0.15)] hover:shadow-none',
    shadowGlow: 'rgba(238, 152, 173, 0.15)'
  },
  slate: {
    id: 'slate',
    primary: '#859EBA',
    hover: '#728CA9',
    bgLight: 'bg-[#859EBA]/8',
    border: 'border-[#859EBA]/25',
    text: 'text-[#4A6482]',
    badgeBg: 'bg-[#859EBA]/12',
    btnClass: 'bg-[#859EBA] hover:bg-[#728CA9] text-white shadow-[2px_2px_0_rgba(133,158,186,0.15)] hover:shadow-none',
    shadowGlow: 'rgba(133, 158, 186, 0.15)'
  }
};

// Map each category to a specific palette
export function getPaletteForCategory(category: string): PastelPalette {
  const cat = category.toLowerCase();
  if (cat.includes('cute') || cat.includes('cozy') || cat.includes('wholesome')) {
    return PASTEL_PALETTES.rose;
  }
  if (cat.includes('animal') || cat.includes('food') || cat.includes('object')) {
    return PASTEL_PALETTES.peach;
  }
  if (cat.includes('funny') || cat.includes('absurd') || cat.includes('random')) {
    return PASTEL_PALETTES.sage;
  }
  if (cat.includes('fantasy') || cat.includes('imagination') || cat.includes('cartoon') || cat.includes('emotion') || cat.includes('dream')) {
    return PASTEL_PALETTES.lavender;
  }
  if (cat.includes('seasonal') || cat.includes('story') || cat.includes('life')) {
    return PASTEL_PALETTES.butter;
  }
  return PASTEL_PALETTES.slate;
}

// Map a difficulty level to a palette
export function getPaletteForDifficulty(difficulty: string): PastelPalette {
  if (difficulty.includes('5')) return PASTEL_PALETTES.sage;
  if (difficulty.includes('10')) return PASTEL_PALETTES.lavender;
  return PASTEL_PALETTES.peach;
}

// Get user's preferred theme palette or cycle through them deterministically
export function getPaletteForUser(userId: string): PastelPalette {
  const keys = Object.keys(PASTEL_PALETTES);
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }
  const key = keys[sum % keys.length];
  return PASTEL_PALETTES[key];
}
