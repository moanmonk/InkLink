import { Prompt } from '../types';

// Deterministic pseudorandom generator based on a seed
function seedRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// 1. Playful Categories specified by user
export const PLAYFUL_CATEGORIES = [
  'Funny', 'Everyday Life', 'Slightly Absurd', 'Cute', 'Fantasy', 'Food', 'Animals',
  'Random Situations', 'Emotions', 'Cartoons', 'Objects with personalities',
  'Tiny stories', 'Imagination', 'Wholesome', 'Cozy', 'Seasonal'
];

// 2. Beautiful Hand-crafted prompts containing ALL user-requested prompts and similar high-quality examples (Days 0 to 100+)
const GOLDEN_HANDCRAFTED_PROMPTS: { text: string; category: string; difficulty: '⚡ 5 min' | '✏️ 10 min' | '🎨 20 min' }[] = [
  { text: "A duck wearing bright yellow rain boots", category: "Cute", difficulty: "⚡ 5 min" },
  { text: "A sleepy baby dragon drinking a steaming mug of hot chocolate", category: "Cozy", difficulty: "✏️ 10 min" },
  { text: "A chunky penguin doing squats at the gym", category: "Funny", difficulty: "✏️ 10 min" },
  { text: "A tiny green frog running a busy espresso coffee shop", category: "Wholesome", difficulty: "🎨 20 min" },
  { text: "Your tired backpack resting after surviving exam week", category: "Everyday Life", difficulty: "✏️ 10 min" },
  { text: "A cute little ghost who is afraid of the dark", category: "Cute", difficulty: "⚡ 5 min" },
  { text: "A professional banana working a boring 9-to-5 office desk job", category: "Slightly Absurd", difficulty: "✏️ 10 min" },
  { text: "A graceful shark wearing a pink tutu learning ballet", category: "Funny", difficulty: "🎨 20 min" },
  { text: "The smiling crescent moon taking a silly phone selfie", category: "Imagination", difficulty: "⚡ 5 min" },
  { text: "Your favorite chocolate chip cookie as a caped superhero", category: "Cartoons", difficulty: "✏️ 10 min" },
  { text: "A fluffy cloud that unfortunately forgot how to rain", category: "Emotions", difficulty: "⚡ 5 min" },
  { text: "A tiny wizard boiling a pot of delicious instant noodles", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A sleepy little robot plugging itself in for a nap", category: "Cozy", difficulty: "⚡ 5 min" },
  { text: "A snobbish pigeon wearing a golden crown who thinks it's royalty", category: "Objects with personalities", difficulty: "✏️ 10 min" },
  { text: "A baby dinosaur carefully trying bubble tea with a giant straw", category: "Cute", difficulty: "✏️ 10 min" },
  { text: "Your bedroom if gravity suddenly stopped working", category: "Imagination", difficulty: "🎨 20 min" },
  { text: "The world's saddest little potato sitting on a bench", category: "Emotions", difficulty: "⚡ 5 min" },
  { text: "A tiny box turtle winning a high-speed Formula 1 race", category: "Slightly Absurd", difficulty: "✏️ 10 min" },
  { text: "A vintage kitchen refrigerator sipping juice on a sunny vacation beach", category: "Objects with personalities", difficulty: "✏️ 10 min" },
  { text: "A cool vampire secretly addicted to warm garlic bread", category: "Funny", difficulty: "✏️ 10 min" },
  { text: "A fierce pirate captain ordering a happy meal at a fast food counter", category: "Random Situations", difficulty: "🎨 20 min" },
  { text: "A dragon working customer service answering phone calls", category: "Slightly Absurd", difficulty: "✏️ 10 min" },
  { text: "A chubby kitten who accidentally got crowned as king of the forest", category: "Wholesome", difficulty: "✏️ 10 min" },
  { text: "A massive friendly blue whale squeezed into a tiny garden swimming pool", category: "Slightly Absurd", difficulty: "🎨 20 min" },
  { text: "A fluffy raccoon opening a bakery with warm croissants", category: "Cozy", difficulty: "🎨 20 min" },
  { text: "A giant scary monster that is actually extremely shy", category: "Wholesome", difficulty: "✏️ 10 min" },
  { text: "A superhero whose only power is making perfectly golden toast", category: "Funny", difficulty: "⚡ 5 min" },
  { text: "A happy snowman sunbathing on a tropical beach island", category: "Seasonal", difficulty: "✏️ 10 min" },
  { text: "A cheeky haunted toaster floating in the air with funny faces", category: "Slightly Absurd", difficulty: "⚡ 5 min" },
  { text: "A fluffy dairy cow becoming an astronaut floating in deep space", category: "Animals", difficulty: "✏️ 10 min" },
  { text: "A lazy wizard casting a spell to fetch the TV remote", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A tiny bumblebee wearing shiny medieval knight armor", category: "Cute", difficulty: "⚡ 5 min" },
  { text: "A cute hamster driving a giant monster truck over obstacles", category: "Cute", difficulty: "✏️ 10 min" },
  { text: "A serious penguin detective inspecting a magnifying glass", category: "Tiny stories", difficulty: "✏️ 10 min" },
  { text: "A transparent jellyfish roasting marshmallows while going camping", category: "Animals", difficulty: "✏️ 10 min" },
  { text: "A spooky skeleton trying difficult yoga poses", category: "Funny", difficulty: "✏️ 10 min" },
  { text: "A plump chicken who is secretly a midnight ninja", category: "Cartoons", difficulty: "✏️ 10 min" },
  { text: "A warm coffee cup looking highly anxious about spilling", category: "Objects with personalities", difficulty: "⚡ 5 min" },
  { text: "A cozy living room couch that came alive and grew a friendly face", category: "Imagination", difficulty: "✏️ 10 min" },
  { text: "A tech-savvy duck wearing headphones stealing the neighbor's WiFi", category: "Funny", difficulty: "✏️ 10 min" },
  { text: "An avocado doing split jumps in a tiny aerobics outfit", category: "Funny", difficulty: "⚡ 5 min" },
  { text: "A wise owl wearing large reading glasses cozying up under a blanket", category: "Cozy", difficulty: "✏️ 10 min" },
  { text: "A giant friendly capybara taking a warm orange-blossom bath", category: "Wholesome", difficulty: "✏️ 10 min" },
  { text: "A tiny cute snail carrying a single giant red strawberry", category: "Cute", difficulty: "⚡ 5 min" },
  { text: "A friendly little alien trying to eat spaghetti with chopsticks", category: "Slightly Absurd", difficulty: "✏️ 10 min" },
  { text: "A marshmallow crying as it gets ready to dive into hot chocolate", category: "Emotions", difficulty: "⚡ 5 min" },
  { text: "A cozy treehouse illuminated by warm fairy lights at sunset", category: "Cozy", difficulty: "🎨 20 min" },
  { text: "A paper airplane flying past the moon carrying a tiny letter", category: "Tiny stories", difficulty: "⚡ 5 min" },
  { text: "A cute woodland fairy taking a nap inside an empty tulip flower", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A retro vintage television showing a fish bowl inside of it", category: "Objects with personalities", difficulty: "✏️ 10 min" },
  { text: "A golden sunflower wearing sunglasses and smiling on a sunny day", category: "Seasonal", difficulty: "⚡ 5 min" },
  { text: "A chubby kitten tangled inside a giant rainbow ball of yarn", category: "Cute", difficulty: "✏️ 10 min" },
  { text: "A happy taco doing a salsa dance with maracas", category: "Food", difficulty: "⚡ 5 min" },
  { text: "A fancy teacup having a tiny boxing match with a wooden spoon", category: "Slightly Absurd", difficulty: "✏️ 10 min" },
  { text: "A slice of delicious pizza escaping a fork on a mini bicycle", category: "Funny", difficulty: "✏️ 10 min" },
  { text: "A beautiful glass greenhouse filled with floating purple jellyfish", category: "Imagination", difficulty: "🎨 20 min" },
  { text: "An antique compass where the needle points directly to a star", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A small cute hedgehog carrying an apple twice its size", category: "Cute", difficulty: "⚡ 5 min" },
  { text: "A rusty old boot auditioning for a glitzy Broadway musical", category: "Objects with personalities", difficulty: "✏️ 10 min" },
  { text: "A proud dog wearing a chef's hat baking bone-shaped biscuits", category: "Wholesome", difficulty: "✏️ 10 min" },
  { text: "A little cloud wearing a colorful winter knit hat and scarf", category: "Seasonal", difficulty: "⚡ 5 min" },
  { text: "A mischievous raccoon opening up a box of fresh donuts", category: "Cozy", difficulty: "✏️ 10 min" },
  { text: "A magical lighthouse casting beams of colorful rainbows", category: "Fantasy", difficulty: "🎨 20 min" },
  { text: "A sleepy sloth hugging a giant warm cappuccino mug", category: "Cozy", difficulty: "✏️ 10 min" },
  { text: "A cute little red panda taking a nap on top of a pile of books", category: "Cute", difficulty: "✏️ 10 min" },
  { text: "An ancient stone gargoyle making a silly funny face to passersby", category: "Slightly Absurd", difficulty: "✏️ 10 min" },
  { text: "A magical key sprouting leafy green vines and delicate white flowers", category: "Fantasy", difficulty: "⚡ 5 min" },
  { text: "A friendly octopus trying to paint on eight canvases at once", category: "Animals", difficulty: "🎨 20 min" },
  { text: "A delicious croissant shaped like a sleeping cat in a display window", category: "Food", difficulty: "✏️ 10 min" },
  { text: "A giant sunflower giving a warm hug to a tired busy bumblebee", category: "Wholesome", difficulty: "✏️ 10 min" },
  { text: "A sleepy marshmallow putting on a tiny black sleeping mask", category: "Cozy", difficulty: "⚡ 5 min" },
  { text: "An old retro record player spinning a disc made of a tree ring", category: "Objects with personalities", difficulty: "✏️ 10 min" },
  { text: "A tiny cute mouse reading a miniature book with a matchstick lamp", category: "Cute", difficulty: "✏️ 10 min" },
  { text: "A friendly yeti sharing an umbrella with a little penguin", category: "Wholesome", difficulty: "✏️ 10 min" },
  { text: "A vintage camera catching memories as tiny floating Polaroid frames", category: "Imagination", difficulty: "✏️ 10 min" },
  { text: "A warm cup of hot cocoa with sweet floating marshmallow clouds", category: "Cozy", difficulty: "⚡ 5 min" },
  { text: "A wizard's tall pointed hat covered in glowing celestial maps", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A small stone well in a magical forest surrounded by wild ferns", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A cute baby owl peeping out of a warm tree hollow on a starry night", category: "Cute", difficulty: "✏️ 10 min" },
  { text: "A warm slice of pumpkin pie dreaming of whipped cream hats", category: "Seasonal", difficulty: "⚡ 5 min" },
  { text: "A vintage bicycle leaning against a cozy village bookstore", category: "Everyday Life", difficulty: "🎨 20 min" },
  { text: "A sleepy robot hugging its battery-charger plush toy", category: "Cute", difficulty: "⚡ 5 min" },
  { text: "A cute little chipmunk carrying an autumn leaf as an umbrella", category: "Seasonal", difficulty: "⚡ 5 min" },
  { text: "A friendly whale carrying a tiny island garden on its back", category: "Imagination", difficulty: "🎨 20 min" },
  { text: "A jar filled with tiny shining stars instead of fireflies", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A teapot shaped like a sleeping garden snail resting on a leaf", category: "Food", difficulty: "✏️ 10 min" },
  { text: "A small puppy wearing a cozy wool sweater sleeping in an armchair", category: "Cozy", difficulty: "✏️ 10 min" },
  { text: "A happy slice of cheese hiding inside a luxurious jewelry box", category: "Slightly Absurd", difficulty: "⚡ 5 min" },
  { text: "A majestic woodland stag with branch antlers blooming with flowers", category: "Fantasy", difficulty: "🎨 20 min" },
  { text: "An antique grandfather clock with a tree growing inside of it", category: "Imagination", difficulty: "🎨 20 min" },
  { text: "A friendly cloud delivering mail to different mountain tops", category: "Tiny stories", difficulty: "✏️ 10 min" },
  { text: "A lazy wizard using a levitation spell to drink juice", category: "Fantasy", difficulty: "✏️ 10 min" },
  { text: "A vintage pocket watch with golden gears turning into green ivy", category: "Imagination", difficulty: "✏️ 10 min" },
  { text: "A pair of worn leather explorer boots covered in colorful patches", category: "Everyday Life", difficulty: "✏️ 10 min" },
  { text: "A delicious cup of coffee reflecting a miniature starry galaxy", category: "Cozy", difficulty: "⚡ 5 min" },
  { text: "A miniature medieval castle carved from driftwood on a beach", category: "Fantasy", difficulty: "🎨 20 min" },
  { text: "A sleepy red panda hugging a bamboo stalk like a giant pillow", category: "Cute", difficulty: "✏️ 10 min" },
  { text: "A wooden rowboat floating calmly on a misty quiet lake", category: "Everyday Life", difficulty: "✏️ 10 min" },
  { text: "A warm cozy fireplace with little glowing soot sprites", category: "Cozy", difficulty: "✏️ 10 min" },
  { text: "A squirrel wearing a tiny hand-knitted green winter scarf", category: "Seasonal", difficulty: "⚡ 5 min" },
  { text: "An old stone bridge over a clear stream filled with glowing fish", category: "Fantasy", difficulty: "🎨 20 min" }
];

// 3. Weekly Ridiculous Prompts (Day of Season is a multiple of 7)
const WEEKLY_RIDICULOUS_PROMPTS = [
  "A fat monkey wearing tight skinny jeans",
  "Flying underwear attacking a giant medieval castle",
  "Superman with an enormous butt stuck in a very tiny red car",
  "A grumpy goldfish wearing a suit becoming president of the ocean",
  "A tiny brown potato starting an energetic heavy metal rock band",
  "The world's strongest mosquito lifting an entire dumbbell",
  "A massive fire-breathing dragon working the drive-thru window at McDonald's",
  "A great white shark wearing a pink ballet tutu learning ballet in a pond",
  "A cheeky haunted refrigerator trying to jump-scare a kitchen cabinet",
  "A banana wearing cool dark sunglasses riding a skateboard down a grand staircase",
  "An existential squirrel debating a walnut about the meaning of life",
  "A grumpy sausage running away from a hungry fork on a tiny unicycle",
  "A proud pug dressed as an emperor commanding an army of rubber ducks",
  "A silly penguin trying to toast a marshmallow over a freezing icicle",
  "A vacuum cleaner trying to suck up the stars in the night sky",
  "A giant green broccoli trying to style its hair with a tiny comb",
  "A fancy tea kettle having a wrestling match with a wooden spatula",
  "A carrot wearing a cool leather jacket riding a fast motorcycle",
  "A ghost trying to fold a fitted sheet and getting extremely frustrated",
  "A dinosaur trying to apply mascara to its eyelashes with its tiny arms",
  "A lazy snail hitchhiking on the back of a hyperactive cheetah",
  "A slice of cheese trying to hide from a grater by wearing a wig",
  "A pineapple trying to squeeze into a jar of pickles",
  "An onion crying because it peeled itself in front of a mirror",
  "A slice of pizza running a marathon while dripping hot cheese",
  "A chicken wearing a scuba mask swimming with goldfishes",
  "A hotdog dog wearing a real mustard hat acting as a security guard",
  "A tomato lifting tiny blueberry weights at the veggie gym"
];

// 4. Large Vocabulary Sets for generating over 3000 unique combination prompts (DayIndex > 100)
const COMB_SUBJECTS = [
  "A cute little puppy", "A chubby kitten", "A tiny green frog", "A friendly little ghost",
  "A sleepy baby dragon", "A chunky penguin", "A cute baby panda", "A fluffy red panda",
  "A slow sleepy sloth", "A tiny cute hedgehog", "An adorable capybara", "A wise old owl",
  "A happy koala", "A fluffy sheep", "A cute baby elephant", "A tiny woodland mouse",
  "A majestic baby unicorn", "A friendly little alien", "A sleepy little robot", "A mischievous raccoon",
  "A brave little hamster", "A transparent jellyfish", "A fluffy squirrel", "A cute baby sea otter",
  "A proud little duckling", "A friendly woodland deer", "A plump ninja chicken", "A little fox cub",
  "A cool cartoon banana", "A happy slice of cheese", "A slice of delicious pizza", "A cute little avocado",
  "A cheerful strawberry", "A warm coffee cup", "A sleepy marshmallow", "A happy little taco",
  "A cheeky haunted toaster", "A friendly refrigerator", "A vintage typewriter", "A retro television",
  "An old leather journal", "A magic grandfather clock", "A cozy armchair", "A tiny wizard's hat",
  "A magical glowing key", "A paper airplane", "A smiling crescent moon", "A fluffy winter cloud",
  "A bright happy sunflower", "A tiny mushroom house", "A friendly blue whale", "A cute box turtle",
  "A pirate parrot", "A bee wearing knight armor", "A detective penguin", "A skeleton doing yoga",
  "A nervous cup of tea", "A sleeping bag with feet", "A backpack with a face", "A treasure chest",
  "A cute piggy bank", "An antique pocket watch", "A friendly green monster", "A garden snail",
  "A funny little potato", "A happy waffle", "A fluffy cupcake", "A bowl of warm ramen",
  "A cool vampire duck", "A sleepy forest fairy", "A mermaid kitten", "A baby phoenix",
  "A robot vacuum cleaner", "A cheerful carrot", "A cozy wool sweater", "A pair of yellow rain boots",
  "A cute potted cactus", "A paper boat", "A yellow submarine", "A fluffy sheep cloud",
  "A red apple with glasses", "A friendly shark", "A lazy wizard toad", "A tiny astronaut hamster",
  "A sleepy gingerbread man", "A happy slice of pumpkin pie", "A cute snowman", "A friendly yeti",
  "A tiny cute ladybug", "A glowing lantern", "A happy croissant", "A cute slice of watermelon",
  "A magical spellbook", "A sleepy little star", "A fluffy raccoon chef", "A dinosaur eating ice cream"
];

const COMB_ACTIVITIES = [
  "drinking a warm mug of hot cocoa", "taking a peaceful little nap", "singing a happy song",
  "reading a tiny leather book", "writing a secret letter", "baking fresh chocolate cookies",
  "planting a tiny green flower", "looking through a telescope", "climbing a mountain of books",
  "swimming inside a giant teacup", "riding a miniature red bicycle", "dancing in the warm rain",
  "listening to a vintage record player", "taking a silly phone selfie", "cooking a pot of instant noodles",
  "doing difficult yoga poses", "driving a tiny toy car", "going on a cozy picnic",
  "wearing a oversized wool sweater", "gazing up at the starry sky", "playing a miniature grand piano",
  "learning graceful ballet moves", "ordering food at a drive-thru", "baking sweet warm croissants",
  "trying a cup of bubble tea", "winning a fast race", "relaxing on a sunny vacation",
  "making a slice of golden toast", "stealing the neighbor's WiFi", "going on a camping trip",
  "trying hard to learn how to fly", "eating a large plate of spaghetti", "flying a colorful kite",
  "building a beautiful sandcastle", "collecting tiny shiny seashells", "catching glowing fireflies",
  "wrapping up a colorful gift", "decorating a green Christmas tree", "blowing giant soap bubbles",
  "making a wish on a star", "hiding inside a warm coat pocket", "balancing carefully on a rope",
  "performing a silly magic trick", "knitting a long colorful scarf", "sweeping the wooden floor",
  "watering a cute potted plant", "painting a funny self-portrait", "composing a tiny poem",
  "folding a delicate paper crane", "gazing at a warm fireplace", "hugging a giant red strawberry",
  "rowing a leaf boat in a pond", "sleeping soundly on a fluffy cloud", "wearing a detective magnifying glass",
  "drinking a giant milkshake", "playing a game of hide and seek", "taking a warm bubble bath",
  "studying a secret treasure map", "whispering a funny secret", "searching for lost gold coins",
  "skating down a paved hill", "sliding down a bright rainbow", "eating a giant chocolate chip cookie",
  "wearing funny dark sunglasses", "trying on a giant wizard hat", "sweating doing squats at the gym",
  "running a cozy neighborhood coffee shop", "being secretly afraid of the dark", "working a boring office desk job"
];

const COMB_SITUATIONS = [
  "on a sunny tropical beach island", "inside a giant glass bottle", "under a warm cozy blanket",
  "beneath a beautiful starry sky", "in a field of glowing purple lavender", "on top of a giant red mushroom",
  "inside a tiny garden swimming pool", "wearing heavy medieval knight armor", "driving a giant monster truck",
  "stuck inside an incredibly tiny car", "wearing very tight skinny jeans", "inside a dusty attic library",
  "on a rainy quiet street corner", "near a crackling warm fireplace", "in the middle of a foggy forest",
  "with gravity completely turned off", "while secretly working as a ninja", "with an expression of pure anxiety",
  "coming alive at the stroke of midnight", "carrying a strawberry twice its size", "pitching a tent under a giant fern",
  "leaning outside a village bookstore", "shaped like a sleeping garden snail", "surrounded by fluttering origami butterflies",
  "with shiny clockwork gears spinning", "lit by a single glowing candle", "with shadows that tell a funny story",
  "on a cozy winter afternoon", "dressed in a tiny wizard robe", "wearing a crown made of autumn leaves",
  "on a bright sunny autumn morning", "during a sudden summer rainstorm", "inside a magical greenhouse garden",
  "surrounded by floating paper lanterns", "with roots dipping into a starry pond", "gently floating on a cloud of steam",
  "weathered by centuries of soft rain", "decorated with hand-drawn star maps", "shining with soft magical starlight",
  "reminiscent of a cozy children's book", "with a touch of quiet mystery", "focusing on beautiful negative space",
  "styled like a vintage field journal", "with delicate warm sepia tones", "capturing a quiet cozy mood",
  "for a tiny story about close friendship", "in a heartwarming cartoon drawing style", "bringing sweet wholesome smiles",
  "with playful little details", "under a giant red umbrella", "on a quiet Sunday morning",
  "while listening to soft ambient music", "wrapped in a fluffy woolen scarf", "eating warm breakfast in bed",
  "in a dreamlike fairy wonderland", "patiently waiting for the weekend", "trying its best to be brave",
  "with an adorable sleepy face expression", "wearing a tiny yellow school backpack", "with sparkly happy eyes"
];

// Helper to get deterministic random item from array
function selectDeterministic<T>(arr: T[], seed: number): T {
  const index = Math.floor(seedRandom(seed) * arr.length);
  return arr[index];
}

// Generates a Prompt object deterministically for any given day index (0 to infinite)
// This guarantees that Day X is identical for all players!
export function getPromptForDay(dayIndex: number): Prompt {
  const seed = dayIndex + 12345; // custom offset seed

  const season = Math.floor(dayIndex / 28) + 1;
  const dayOfSeason = (dayIndex % 28) + 1;

  // Every 7th day is a completely ridiculous prompt
  const isWeeklyRidiculous = dayOfSeason % 7 === 0;

  let text = '';
  let category = '';
  let difficulty: '⚡ 5 min' | '✏️ 10 min' | '🎨 20 min' = '✏️ 10 min';

  if (isWeeklyRidiculous) {
    category = 'Slightly Absurd';
    // Select from weekly ridiculous prompts
    const ridIdx = (season * 4 + Math.floor(dayOfSeason / 7)) % WEEKLY_RIDICULOUS_PROMPTS.length;
    text = WEEKLY_RIDICULOUS_PROMPTS[ridIdx];
    difficulty = '🎨 20 min';
  } else if (dayIndex < GOLDEN_HANDCRAFTED_PROMPTS.length) {
    // Select from our handcrafted high-quality prompt database
    const item = GOLDEN_HANDCRAFTED_PROMPTS[dayIndex];
    text = item.text;
    category = item.category;
    difficulty = item.difficulty;
  } else {
    // Deterministic combination for infinite unique prompts (> 3000!)
    const seedS = seed * 3;
    const seedA = seed * 5;
    const seedSi = seed * 7;
    const seedC = seed * 11;
    const seedD = seed * 13;

    const subject = selectDeterministic(COMB_SUBJECTS, seedS);
    const activity = selectDeterministic(COMB_ACTIVITIES, seedA);
    const situation = selectDeterministic(COMB_SITUATIONS, seedSi);

    text = `${subject} ${activity} ${situation}`;
    category = selectDeterministic(PLAYFUL_CATEGORIES, seedC);

    // Assign drawing times deterministically
    const dRoll = seedRandom(seedD);
    if (dRoll < 0.25) {
      difficulty = '⚡ 5 min';
    } else if (dRoll < 0.75) {
      difficulty = '✏️ 10 min';
    } else {
      difficulty = '🎨 20 min';
    }
  }

  return {
    id: `prompt_${dayIndex}`,
    text,
    category,
    difficulty,
    estimatedTime: difficulty === '⚡ 5 min' ? '5 mins' : difficulty === '✏️ 10 min' ? '10 mins' : '20 mins',
    isWeeklyRidiculous,
    season,
    dayOfSeason
  };
}

// Dynamic Search indexing across our combined infinite pool
export function searchPrompts(query: string, limit = 50): Prompt[] {
  const lowercaseQuery = query.toLowerCase();
  const matched: Prompt[] = [];
  
  // Search through first 3500 days to find unique matches!
  for (let i = 0; i < 3500; i++) {
    const p = getPromptForDay(i);
    if (p.text.toLowerCase().includes(lowercaseQuery) || p.category.toLowerCase().includes(lowercaseQuery)) {
      matched.push(p);
      if (matched.length >= limit) break;
    }
  }
  return matched;
}

// 5. Encorage Messages list for daily motivation
export const ENCOURAGING_MESSAGES = [
  "Done is better than perfect.",
  "Every sketch counts.",
  "Have fun with this one.",
  "Draw it your way.",
  "No pressure, just pencils.",
  "Even stick figures are welcome.",
  "Your personal style is your superpower.",
  "Mistakes are just happy design accidents.",
  "Relax, breathe, and let your pen wander.",
  "A draft today is a treasure tomorrow.",
  "Just 5 minutes of sketching changes the day.",
  "Every line is progress."
];

export function getEncouragementForDay(dayIndex: number): string {
  const idx = (dayIndex + 42) % ENCOURAGING_MESSAGES.length;
  return ENCOURAGING_MESSAGES[idx];
}
