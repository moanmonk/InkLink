export interface ReferenceImage {
  id: string;
  title: string;
  category: 'artsy_ink' | 'overgrown_ruins' | 'chimeras' | 'simple_objects';
  imageUrl: string;
  description: string;
  artistNote: string;
  suggestedPrompts: string[];
}

export const REFERENCE_GALLERY: ReferenceImage[] = [
  {
    id: 'ref_skull_forest',
    title: 'Ancient Overgrown Skull in Pine Forest',
    category: 'overgrown_ruins',
    imageUrl: '/references/skull_forest.jpg',
    description: 'Line art with soft watercolor wash depicting a giant ancient skull with tall pine trees sprouting from the eye socket, mossy stones, and foliage.',
    artistNote: 'Focus on heavy ink outlines for the trees and organic contours. Use transparent watercolor washes of sage green, ochre, and slate for texture.',
    suggestedPrompts: [
      'An ancient giant stone skull overgrown with pine trees and wild moss',
      'A forgotten relic covered in climbing ivy and forest flora',
      'A majestic ancient guardian dissolving back into the forest floor'
    ]
  },
  {
    id: 'ref_chimera',
    title: 'Fox-Owl Chimera with Butterfly Wings',
    category: 'chimeras',
    imageUrl: '/references/chimera.jpg',
    description: 'Whimsical creature mashup combining a cozy red fox face, barn owl feathers, and monarch butterfly wings perched on a mossy branch.',
    artistNote: 'Combine soft feather hatching with delicate wing patterns. Use a warm terracotta and sage color accent palette.',
    suggestedPrompts: [
      'A mythical chimera creature combining a red fox, barn owl, and monarch wings',
      'A tiny forest spirit with owl eyes and fox ears napping on a branch',
      'A hybrid creature keeping watch over a golden autumn forest'
    ]
  },
  {
    id: 'ref_greenhouse',
    title: 'Cozy Glass Greenhouse & Fountain Pens',
    category: 'artsy_ink',
    imageUrl: '/references/greenhouse.jpg',
    description: 'A cozy sanctuary with glass panes, lush potted ferns, glowing warm lanterns, and ink bottles on a timber desk.',
    artistNote: 'Use crisp linear perspective for the glass frame panes, paired with loose organic watercolor splashes for the fern leaves.',
    suggestedPrompts: [
      'A quiet glass greenhouse filled with overgrown ferns and vintage ink bottles',
      'A sanctuary desk where botanists brew ink from rare flowers',
      'Warm lanterns illuminating a rainy botanical laboratory'
    ]
  },
  {
    id: 'ref_fountain_pen_journal',
    title: 'Vintage Fountain Pen & Warm Coffee',
    category: 'artsy_ink',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop',
    description: 'A quiet morning desk scene with a bronze fountain pen, a steaming ceramic mug, open parchment journal, and dry botanical stems.',
    artistNote: 'Capture the warm glow using soft ochre washes. Keep the pen lines thin and precise around the brass nib.',
    suggestedPrompts: [
      'A vintage journal left open on a wooden table beside warm morning tea',
      'An architect drafting ideas in an old leather notebook',
      'A quiet sanctuary table covered in ink bottles and dried pressed flowers'
    ]
  },
  {
    id: 'ref_rainy_window',
    title: 'Raindrops on Window & Steaming Cup',
    category: 'artsy_ink',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop',
    description: 'Moody indoor scene looking through rain-streaked glass at blurred distant city light reflections.',
    artistNote: 'Practice negative space for the water droplets on glass. Use dark slate ink washes for the background blur.',
    suggestedPrompts: [
      'A cozy window seat looking out at a soft afternoon rainstorm',
      'Raindrops dancing across glass while steam rises from a teacup',
      'A lonely city light reflecting off wet asphalt at dusk'
    ]
  },
  {
    id: 'ref_starry_mountains',
    title: 'Starry Sky & Silhouette Pines',
    category: 'overgrown_ruins',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
    description: 'A dramatic celestial scene featuring deep mountain silhouettes, a glowing crescent moon, and pine tree outlines.',
    artistNote: 'Layer dark indigo ink for the night sky, leaving white paper specks for twinkling stars. Use sharp black ink for tree silhouettes.',
    suggestedPrompts: [
      'A moonlit pine forest under an infinite starry sky',
      'A lone traveler stargazing on a snowy mountain ridge',
      'A celestial constellation map drawn over wild mountains'
    ]
  },
  {
    id: 'ref_terrarium_crystals',
    title: 'Botanical Glass Terrarium & Crystals',
    category: 'simple_objects',
    imageUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=800&auto=format&fit=crop',
    description: 'An enchanted glass container enclosing miniature moss, quartz crystals, and tiny sprouting flora.',
    artistNote: 'Focus on geometric glass facets and soft organic hatching inside. Accent with subtle mint and quartz highlights.',
    suggestedPrompts: [
      'A miniature world trapped inside a crystal potion bottle',
      'A tiny botanical terrarium glowing with magical luminescence',
      'A geometric glass garden resting on a windowsill'
    ]
  },
  {
    id: 'ref_koi_pond',
    title: 'Floating Lotus & Golden Koi Fish',
    category: 'artsy_ink',
    imageUrl: 'https://images.unsplash.com/photo-1520301255226-bf5f144451c1?q=80&w=800&auto=format&fit=crop',
    description: 'Serene water surface with floating lotus leaves, gentle water ripples, and bright orange koi swimming below.',
    artistNote: 'Use graceful continuous curving lines for the fish bodies and soft circular washes for the water ripples.',
    suggestedPrompts: [
      'Golden koi fish circling a floating lotus flower',
      'A tranquil water garden with lily pads and reflected clouds',
      'A mythical water spirit taking the form of a shining koi'
    ]
  },
  {
    id: 'ref_napping_cat',
    title: 'Cat Sleeping on Vintage Book Stack',
    category: 'chimeras',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
    description: 'Cozy indoor scene featuring a fluffy cat curled up sound asleep atop stacked hardcover books in warm sunlight.',
    artistNote: 'Use loose, soft hatching for the cat fur and crisp straight edge lines for the book spines.',
    suggestedPrompts: [
      'A lazy cat napping on a tower of ancient leatherbound books',
      'A cozy library corner bathed in golden afternoon sunbeams',
      'A bookstore guardian taking a quiet afternoon nap'
    ]
  },
  {
    id: 'ref_misty_forest',
    title: 'Misty Woodland Path & Ancient Trees',
    category: 'overgrown_ruins',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
    description: 'An atmospheric forest corridor with tall ancient trees, morning fog filtering light, and lush fern undergrowth.',
    artistNote: 'Create atmosphere by making background trees lighter and foreground trunks dark and detailed.',
    suggestedPrompts: [
      'A winding path through a foggy enchanted woodland',
      'Sunbeams breaking through morning mist in a quiet forest',
      'An ancient overgrown forest gate hidden in moss'
    ]
  }
];
