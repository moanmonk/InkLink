import { Prompt } from '../types';
import { REFERENCE_GALLERY } from './references';

// Deterministic pseudorandom generator based on a seed
function seedRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const PROMPT_CATEGORIES = [
  "Character Design",
  "Emotion",
  "Memories",
  "Longing",
  "Horror",
  "Mystery",
  "Fantasy",
  "Dreams",
  "Atmosphere",
  "Storytelling",
  "Everyday Life",
  "Cinematic",
  "Nature",
  "Urban",
  "Cozy",
  "Style Challenge",
  "Objects & Places",
  "Adventure",
  "Sci-Fi",
  "Historical",
  "Mythology",
  "Seasonal",
  "Live & Simple Objects",
  "Weekly Unhinged"
];

const CATEGORY_VOCABULARY: Record<string, { subjects: string[], situations: string[], environments: string[] }> = {
  "Character Design": {
    subjects: [
      "A retired monster hunter", "A pirate librarian", "A royal bodyguard", "A wandering chef", 
      "A cursed king", "The final boss of a forgotten game", "A detective who never removes their mask",
      "A clockwork tailor", "A blind cartographer of invisible lands", "A weary sky-captain",
      "A glassblower who traps sighs", "A scribe writing the last page of history", "A mechanical sentinel that loves birds",
      "A dollmaker whose creations whisper at night", "A tea brewer who speaks to spirits", "A quiet astronomer",
      "A merchant of stolen shadows", "A warrior who fights with a wooden sword", "A lighthouse keeper who is a ghost",
      "A street performer juggling fallen stars", "A scholar of ancient star charts"
    ],
    situations: [
      "repairing a delicate porcelain wing", "sewing a coat out of autumn leaves", "looking at an old faded portrait",
      "clutching an unbroken hourglass", "carrying a suitcase of glowing letters", "teaching a wild crow how to speak",
      "searching for their misplaced shadow", "waiting for a train that left decades ago", "painting a map of their dreams",
      "brewing tea from dry rose petals", "reading a letter in a foreign language", "mending a broken sword with gold",
      "sleeping under a yellow umbrella", "assembling a tiny brass clockwork heart"
    ],
    environments: [
      "in a dusty, candlelit archives room", "at a train station where nobody remembers arriving", "on a quiet street corner at midnight",
      "inside a magical greenhouse garden", "beneath the roots of a grand ancient oak", "in a cozy village bookstore",
      "overlooking a sea of soft clouds", "in a small forgotten tavern", "inside a sanctuary of sleeping birds",
      "on the deck of a wooden airship"
    ]
  },
  "Emotion": {
    subjects: [
      "Being trapped by your own thoughts", "Waiting for a message that never comes", "Carrying invisible chains",
      "Hope sparking in the darkest hour", "Regret turning into stone", "Nostalgia sweeping through an empty corridor",
      "Freedom in the middle of a rainstorm", "Jealousy as a growing shadow", "Relief after a long quiet journey",
      "Growing apart from someone you loved", "Homesickness under a foreign sky", "Feeling lost in a crowd of friendly faces",
      "Finding peace in a small forgotten garden", "Moving on and leaving a key behind", "Guilt represented as a heavy crown",
      "Loneliness sitting at a table set for two", "Joy bursting through cracked pavement", "Grief as a gentle, quiet snow",
      "The warmth of a sudden, quiet understanding", "A heart made of fragile stained glass"
    ],
    situations: [
      "wrapped in a blanket of memories", "standing on the edge of a quiet lake", "surrounded by drifting autumn leaves",
      "looking at a fading reflection", "clutching a single paper crane", "sitting on an old wooden bench",
      "watching the world pass by in black and white", "reaching out for a hand that isn't there", "watching a single candle burn down",
      "listening to the sound of distant rain"
    ],
    environments: [
      "in an empty, echoey hall", "under a gray, endless winter sky", "in a sun-drenched room filled with dust motes",
      "on a quiet train ride at twilight", "at a crossroads where the signs have faded", "in a peaceful room filled with plants",
      "inside a small attic of childhood toys"
    ]
  },
  "Memories": {
    subjects: [
      "Your happiest memory", "Your worst school day", "The place you always return to", "Your dream vacation",
      "A childhood smell", "A rainy afternoon you remember", "The first time you felt proud", "The day everything changed",
      "A half-remembered lullaby", "A sun-drenched kitchen", "An old toy that still whispers its owner's name",
      "The last conversation before a long journey", "A worn-out photo in a dusty frame", "The sound of laughter in a house that is now silent",
      "A bicycle ride at sunset with no destination", "A tree house built from scrap wood", "An empty playground at dusk"
    ],
    situations: [
      "fading like old newspaper ink", "preserved inside a glass jar", "glowing with a soft amber light",
      "covered in a light layer of dust", "replaying in a loop like an old film", "bringing back the warmth of summer",
      "tangled in wild ivy and sweet-pea vines", "floating away on a gentle breeze", "etched into the bark of an old tree"
    ],
    environments: [
      "in a nostalgic, sepia-toned world", "under a warm summer sun", "during a quiet winter afternoon",
      "in an old, overgrown backyard", "inside a vintage photobook", "along a dusty country road",
      "near a crackling, cozy fireplace"
    ]
  },
  "Longing": {
    subjects: [
      "Something you love but can never have", "The life you imagine before falling asleep", "Looking at a distant star and wishing you were there",
      "An empty chair waiting for someone who won't return", "A message in a bottle floating on an endless ocean",
      "A key that fits a door that no longer exists", "Reaching for a shadow that disappears when touched",
      "A letter written but never sent", "Waiting at the gates of a forgotten city", "A music box that only plays when you are sad",
      "A ship sailing towards the horizon without you", "A hand reaching for a falling star", "An envelope with a blank stamp",
      "A telescope pointed at a planet made of water"
    ],
    situations: [
      "waiting patiently in the fog", "slowly dissolving into stardust", "calling out into an empty canyon",
      "searching for a familiar face", "listening to a melody with no words", "gazing at a closed iron gate",
      "counting the seconds on a clock with no hands", "holding onto a thread that is breaking"
    ],
    environments: [
      "on a quiet, misty pier at dawn", "at the edge of a cliff overlooking the sea", "in an empty station with locked doors",
      "under an absolute midnight sky", "in a quiet room with a single window", "on a windy hilltop with tall grass",
      "inside a library of lost manuscripts"
    ]
  },
  "Horror": {
    subjects: [
      "A staircase that never ends", "Someone watching from the window", "A playground after midnight",
      "A smile that feels wrong", "The last person awake", "A forgotten hospital room", "A town where nobody speaks",
      "A shadow that moves slower than you", "A mirror that shows your room, but empty", "A telephone that rings in an empty forest",
      "A locked drawer scratching from the inside", "A door where the handle turns on its own", "An eye looking through a crack in the wall",
      "A television screen displaying your back"
    ],
    situations: [
      "lit by a single flickering light", "swallowed by a creeping black fog", "standing perfectly still in the dark",
      "dripping with cold, quiet dread", "surrounded by dolls with glass eyes", "echoing with a soft, slow whisper",
      "with footprints leading into the wall", "where the shadows stretch in the wrong direction"
    ],
    environments: [
      "in an abandoned old schoolhouse", "inside a damp, mossy basement", "along a lonely highway at 3 AM",
      "in a silent, dark forest of dead trees", "inside an empty, sterile white hallway", "under an old creaky bridge"
    ]
  },
  "Mystery": {
    subjects: [
      "The last page of an unsolved case", "A locked door nobody questions", "A train with no destination",
      "The missing photograph", "A suitcase left behind", "An abandoned lighthouse", "A set of wet footprints on dry carpet",
      "A diary with entries dated in the future", "A key found inside a fresh loaf of bread", "A vintage typewriter typing on its own",
      "An envelope marked 'open in fifty years'", "A pocket watch that ticks backwards"
    ],
    situations: [
      "hidden under a loose wooden floorboard", "whispering a riddle in Morse code", "covered in mysterious golden symbols",
      "resting under a single spotlight", "wrapped in heavy velvet fabric", "revealed by a sudden flash of lightning",
      "pointing to a coordinates map on a desk", "leaving a trail of glowing blue sand"
    ],
    environments: [
      "in a rainy city at midnight", "inside a dusty, old mansion library", "on a foggy pier where a ship just left",
      "at an antique shop filled with relics", "inside a secret room behind a bookshelf", "at a dark museum gallery"
    ]
  },
  "Fantasy": {
    subjects: [
      "The last dragon protecting a ruined kingdom", "A traveler collecting stars", "A sword stuck in a stone that grows wild roses",
      "An ancient library where books fly like birds", "A bridge made entirely of frozen moonlight", "A small tavern serving forest spirits",
      "A glowing map that reveals hidden paths", "A crown made of glass and frost", "A merchant who trades in dreams and whispers",
      "A sleeping giant covered in pine trees", "A deer with antlers made of blooming cherry trees", "A castle floating on a single cloud"
    ],
    situations: [
      "casting a soft, warm magical glow", "singing to a sleeping forest", "guarding an ancient golden chest",
      "floating gently on a magical draft", "brewing a potion of pure luck", "weaving thread out of starlight",
      "resting in a shrine of moss and stone", "offering water to a weary traveler"
    ],
    environments: [
      "in a magical, whispering forest", "under a sky with three moons", "inside an ancient mountain cave of crystals",
      "at the edge of a starry celestial pond", "in a valley of glowing giant mushrooms", "at a cliffside shrine"
    ]
  },
  "Dreams": {
    subjects: [
      "A hallway where every door is slightly open", "A train station where nobody remembers arriving", "Floating through a sky of paper fish",
      "A library where all pages are blank", "Walking on water that reflects a different sky", "A clock that runs backwards in a cozy room",
      "An endless spiral of floating doors and keys", "A garden where flowers bloom in neon colors", "Slipping through the cracks of a chalkboard",
      "Conversing with a shadow that has your voice", "A house that is bigger on the inside", "A staircase leading into the clouds"
    ],
    situations: [
      "defying gravity with every step", "wrapped in a soft, pastel mist", "melting like warm candle wax",
      "fading away as you try to touch it", "playing a song you've never heard before", "shifting shapes whenever you look away",
      "lit by a soft, surreal purple light", "floating on a river of liquid starlight"
    ],
    environments: [
      "inside a dreamscape of floating islands", "in a world made entirely of watercolor washes", "under a sky filled with constellations",
      "in an infinite room of mirrors", "along a beach where the sand glows blue", "inside a cozy cloud sanctuary"
    ]
  },
  "Atmosphere": {
    subjects: [
      "A rainy city at midnight", "The moment before everything changes", "A quiet museum after the lights go out",
      "A misty morning where the world is just silhouettes", "The first snowfall on a quiet, sleepy street",
      "A warm lantern lighting up a foggy alleyway", "A beach where the sand is black and the water is silver",
      "Sunset over an endless field of glowing lavender", "An old attic filled with dust motes and memories",
      "The golden hour filtering through a dusty window", "A thunderstorm rolling in over a vast plain"
    ],
    situations: [
      "drenched in deep blue shadows", "bathed in a soft amber glow", "shivering in the cool autumn breeze",
      "shining under a lonely spotlight", "wrapped in a thick blanket of fog", "painted with soft pastel brushstrokes",
      "quietly resting in absolute stillness", "lit by the soft neon glow of a café sign"
    ],
    environments: [
      "on a quiet street corner", "in a vast, empty wilderness", "along a historic stone bridge",
      "inside a cozy, quiet study room", "at a sleepy train stop", "on an overgrown rooftop greenhouse"
    ]
  },
  "Storytelling": {
    subjects: [
      "A room someone left in a hurry", "The hero after losing", "The villain before becoming evil",
      "A traveler telling stories around a campfire", "An empty throne in a majestic, silent hall", "The last letter written by an explorer",
      "A path split in two with a single warning sign", "A broken shield resting against a stone monument", "An old map with a cross marked 'Here lies hope'",
      "A messenger bird carrying a blank scroll", "A sword retired and used as a fireplace poker"
    ],
    situations: [
      "telling a silent story of old battles", "waiting for the curtain to rise", "marked with the scars of a long journey",
      "half-covered by creeping green ivy", "glowing with the last embers of fire", "lying forgotten in the tall grass",
      "waiting for a hand to reclaim it", "cast aside on a cold stone floor"
    ],
    environments: [
      "in a ruined castle throne room", "at a campsite under a starry wilderness sky", "along a winding trail of stepping stones",
      "inside a dusty museum display case", "on a quiet mountain pass at dawn", "inside a forgotten warrior's tomb"
    ]
  },
  "Everyday Life": {
    subjects: [
      "Your dream home", "A quiet afternoon doing nothing", "The perfect cup of tea", "A cat napping on a stack of laundry",
      "Walking home under a sunset sky", "Watering a single green sprout on a windowsill", "An old wooden desk covered in sketchbooks",
      "Getting lost in a book on a busy train", "A messy room that feels incredibly cozy", "Cooking a warm meal for yourself",
      "A pair of worn-out sneakers by the front door", "An open sketchpad with a pencil resting on it"
    ],
    situations: [
      "filled with a feeling of quiet contentment", "bathed in the soft light of Sunday morning", "surrounded by a pile of favorite books",
      "warming your hands on a cold evening", "humming a quiet tune to yourself", "resting after a long, productive day",
      "enjoying a slow, mindful breath of fresh air", "creating a small mess of watercolor paints"
    ],
    environments: [
      "in a cozy, sunlit apartment", "on a peaceful neighborhood street", "at a small window seat looking at a garden",
      "at a local park bench under a sturdy tree", "inside a warm, busy kitchen", "on a train winding through fields"
    ]
  },
  "Cinematic": {
    subjects: [
      "The climax of a movie you haven't seen", "A lone figure standing against an incoming storm", "An epic escape across a crumbling bridge",
      "A dramatic reunion under a pouring rainstorm", "The final shot of a classic film", "A neon-lit street reflecting a car chase",
      "A hero looking out over a futuristic metropolis at sunrise", "A majestic vessel launching into the unknown", "The final stand of a legendary warrior",
      "A traveler reaching the peak of a high mountain range"
    ],
    situations: [
      "captured in high-contrast wide-screen frame", "bathed in dramatic cinematic backlighting", "with debris and petals swirling in the air",
      "framed by a massive, arching gateway", "with dramatic shadows casting long silhouettes", "looking down at an endless ocean of clouds",
      "standing resolute against the odds", "with a single tear catching the light"
    ],
    environments: [
      "against a sky of deep crimson and gold", "on a high cliff overlooking a futuristic city", "inside an ancient, grand temple hall",
      "along an endless desert highway", "at a dramatic, misty sea shore", "in a neon-drenched urban canyon"
    ]
  },
  "Nature": {
    subjects: [
      "A forest that doesn't want visitors", "A waterfall that flows upwards", "A giant tree hollow that serves as a sanctuary",
      "A field of flowers that glow under the moon", "An ancient mountain with a face carved by wind", "A river reflecting shooting stars",
      "A secret cave hidden behind a curtain of ivy", "Autumn leaves swirling in a mini tornado", "A lonely pine tree standing tall on a cliff",
      "A quiet mossy stone where forest fairies rest", "A grove of birch trees with bark that shimmers"
    ],
    situations: [
      "whispering secrets in the breeze", "growing thick with glowing moss and mushrooms", "shining with morning dew like diamonds",
      "changing colors in a single instant", "sheltering a family of forest animals", "undisturbed by the passage of time",
      "breathing slowly in the quiet twilight", "dancing under a canopy of green leaves"
    ],
    environments: [
      "deep in the heart of the wildwood", "high on a wind-swept peak", "along a winding crystalline stream",
      "in a hidden sunlit valley of ferns", "at the edge of a deep, ancient lake", "inside a cavern of glowing stone"
    ]
  },
  "Urban": {
    subjects: [
      "A subway car filled with quiet strangers", "An alleyway decorated with colorful murals", "Rooftops overlooking a bustling city",
      "A small plant growing in a crack of concrete", "A historic clock tower surrounded by skyscrapers", "A neon sign flickering in a quiet corner",
      "An old telephone booth converted into a library", "A street artist drawing with chalk on pavement", "A streetcar winding through a historic district",
      "An abandoned theater with velvet seats"
    ],
    situations: [
      "glowing with the warm lights of a rainy night", "buzzing with the soft hum of evening traffic", "bathed in the orange glow of streetlamps",
      "reflecting in a rain puddle on the asphalt", "framed by criss-crossing telephone wires", "decorated with festive paper lanterns",
      "quietly resting after the morning rush", "standing as a silent relic of the past"
    ],
    environments: [
      "in a sprawling, modern metropolis", "along a historic cobblestone street", "on a rooftop garden overlooking the skyline",
      "at a quiet subway platform", "inside a cozy corner diner", "at an old city plaza with a fountain"
    ]
  },
  "Cozy": {
    subjects: [
      "Your ideal reading corner", "A tiny cabin during a heavy snowfall", "A warm café on a rainy evening",
      "A room filled with flourishing green plants", "The perfect Sunday morning", "A cup of hot coffee next to a sleeping puppy",
      "Knitting a soft scarf by a fireplace", "A table filled with freshly baked bread", "A cozy bed with a mountain of pillows",
      "A window seat looking out at a quiet garden", "A mug of warm cider with cinnamon sticks"
    ],
    situations: [
      "wrapped in a warm, chunky wool blanket", "lit by the soft, golden light of string bulbs", "with steam curling lazily into the air",
      "filled with the scent of fresh pine and rain", "echoing with the quiet purr of a sleeping cat", "surrounded by stack of leather notebooks",
      "while listening to the gentle patter of raindrops", "creating a sanctuary of quiet and calm"
    ],
    environments: [
      "inside a tiny, wooden forest cottage", "at a sleepy village bookstore nook", "in a warm, timber-framed attic room",
      "on a quiet, lazy sun-porch", "near a crackling, brick hearth fireplace"
    ]
  },
  "Style Challenge": {
    subjects: [
      "Design a character inspired by autumn", "Design a city inspired by music", "Design a sword inspired by the ocean",
      "Design a café inspired by the moon", "Design a monster inspired by insomnia", "Design an outfit inspired by a rainy afternoon",
      "Design a castle inspired by paper origami", "Design a spirit inspired by forest moss", "Design a dragon inspired by cherry blossoms",
      "Design a vehicle inspired by a pocket watch", "Design a key inspired by a grandfather clock"
    ],
    situations: [
      "using flowing, elegant organic linework", "drawn using only a single shade of ink", "focusing heavily on beautiful negative space",
      "combining sharp geometric shapes and soft textures", "styled like a page from a vintage explorer's journal", "using simple, bold graphic silhouettes",
      "with delicate, intricate repeating patterns", "inspired by woodblock printing styles"
    ],
    environments: [
      "on a clean, crisp parchment paper backdrop", "framed by a neat circular boundary", "sketched with subtle, dry brush strokes",
      "with a high-contrast inkwash overlay", "styled in classic vintage book plates"
    ]
  },
  "Objects & Places": {
    subjects: [
      "An ancient well filled with coins and stars", "An antique camera that captures the past", "A hidden attic shelf of old globes",
      "A wooden cabinet with a miniature world inside", "A key with no matching lock", "A vintage typewriter with a page half-written",
      "A glass terrarium holding a miniature storm", "An old pocket watch stopped on a specific minute", "A majestic library with shelves to the sky",
      "An antique mirror that shows a different season", "A wooden writing slope with inkwells"
    ],
    situations: [
      "covered in a fine velvet of moss and dust", "shining with a subtle, internal golden light", "surrounded by scattered handwritten letters",
      "resting on a dark polished mahogany desk", "wrapped in an old piece of silk ribbon", "weathered by many decades of use",
      "reflecting a soft, warm candle flame", "with clockwork gears slowly spinning inside"
    ],
    environments: [
      "in a quiet, dusty corner of the room", "inside a grand collector's cabinet", "on a high mantelpiece above a fireplace",
      "at the center of a silent, forgotten room", "under a glass dome on a wooden table"
    ]
  },
  "Adventure": {
    subjects: [
      "A map leading to a city that doesn't exist", "An explorer scaling a giant stone statue", "A path leading through giant mushrooms",
      "A hot air balloon sailing over uncharted mountains", "A wooden ship navigating a sea of clouds", "A hidden temple entrance guarded by ivy",
      "A backpack stuffed with maps and compasses", "Crossing a rope bridge over a deep misty canyon", "An old lantern guiding a secret path",
      "A traveler looking at a massive landmark in the distance"
    ],
    situations: [
      "searching for clues in ancient ruins", "following a trail of glowing breadcrumbs", "discovering a hidden passage behind a waterfall",
      "braving a sudden, swirling gust of wind", "mapping out the paths of an unexplored valley", "climbing towards a glowing castle on high",
      "navigating by the alignment of the stars", "resting for a brief moment on the trail"
    ],
    environments: [
      "deep inside a lost subterranean city", "high above a vast, wilderness of pine forests", "along a steep, rocky cliffside track",
      "in a canyon where the walls are carved with runes", "at a historic stone crossroads"
    ]
  },
  "Sci-Fi": {
    subjects: [
      "An abandoned space station orbiting a blue planet", "A robot learning to care for a delicate flower", "A futuristic city with flying streetcars",
      "An astronaut looking at Earth from the moon", "A greenhouse on a dome-covered Mars colony", "A holographic memory playing in an empty room",
      "A cybernetic helper brewing a cup of tea", "A spaceship repair shop in an asteroid belt", "A neon-lit cyber bazaar at midnight",
      "A telescope observing a distant nebula", "A machine that records the sound of starlight"
    ],
    situations: [
      "glowing with soft turquoise neon lights", "operating in complete, peaceful zero-gravity", "covered in a thin layer of alien dust",
      "transmitting a weak, rhythmic signal into the dark", "projecting a soft, flickering blue light", "decorated with green plants in metal pots",
      "tending to a small, indoor garden of wheat", "floating silently in the endless deep space"
    ],
    environments: [
      "on the observation deck of a vessel", "inside a high-tech subterranean laboratory", "at a futuristic repair bay",
      "against a backdrop of countless distant stars", "inside a quiet, dome-covered biodome colony"
    ]
  },
  "Historical": {
    subjects: [
      "A scribe working by candlelight in a monastery", "An ancient Roman marketplace at sunrise", "A Victorian study filled with maps",
      "A vintage train station in the early 1900s", "An Egyptian stone carver polishing hieroglyphs", "A majestic castle hall prepared for a banquet",
      "An old-world apothecary shop with jars of herbs", "A traditional wooden tea house in ancient Kyoto", "A scholar reading scroll by a oil lamp"
    ],
    situations: [
      "written with elegant, old-world calligraphy", "dressed in rich, historic flowing robes", "filled with the soft scratching of a quill pen",
      "bathed in the warm, dusty light of afternoon", "resting on a table of heavy carved oak", "surrounded by vials of colorful inks",
      "perfectly preserved in the passage of centuries", "capturing the quiet essence of a bygone era"
    ],
    environments: [
      "inside a grand stone scriptorium", "at a quiet, timber-framed merchant stall", "in a cozy parlor with velvet curtains",
      "at a dusty writing desk covered in parchment", "in a tranquil garden with stone lanterns"
    ]
  },
  "Mythology": {
    subjects: [
      "A celestial fox with nine tails painting the sky", "A phoenix rising from golden embers", "An encounter with a forest satyr",
      "A majestic pegasus resting on a cloud peak", "An offering left at a shrine of river spirit", "A sea serpent guiding a lost sailboat",
      "The golden scales of a wise dragon", "A Valkyrie looking down from a cloud", "A stone statue of a deity overgrown with vines"
    ],
    situations: [
      "surrounded by a halo of soft divine starlight", "whispering an ancient oath to the wind", "leaving glowing footprints in the grass",
      "bathing in a pool of liquid gold", "guarding an ancient, sacred temple gateway", "weaving a tapestry of mortal fates",
      "resting in a sanctuary of wildflowers", "gazing out over the mortal world with ancient eyes"
    ],
    environments: [
      "high on the snow-covered peak of Mount Olympus", "at a mossy shrine deep in a bamboo grove", "on the shores of an emerald, sacred lake",
      "inside a cavern of columns made of basalt", "against a sky of blazing cosmic colors"
    ]
  },
  "Seasonal": {
    subjects: [
      "A scarecrow wearing a warm knitted hat", "A frozen pond reflecting a pink sunrise", "A cherry blossom petal landing on water",
      "A picnic blanket under a warm summer sun", "Harvesting ripe pumpkins on a crisp morning", "A snow globe containing a tiny cozy village",
      "Summer fireflies lighting up a dark field", "A spring garden waking up after winter", "An autumn forest painted in deep red and gold"
    ],
    situations: [
      "celebrating the first day of spring blossoms", "shivering under a blanket of white snow", "bathed in the bright, golden heat of July",
      "surrounded by falling leaves of orange and rust", "glowing with the warmth of a seasonal hearth", "bringing the joy of harvest festival",
      "decorated with handmade seasonal wreaths", "quietly sleeping through the winter solstice"
    ],
    environments: [
      "in an orchard of apple trees", "in a backyard covered in fresh winter frost", "along a lane bordered by pink blossoms",
      "at a lakeside cabin under summer stars", "in a quiet clearing of a golden forest"
    ]
  },
  "Weekly Unhinged": {
    subjects: [
      "Superman with an absurdly oversized butt stuck in a tiny elevator",
      "A bodybuilder fairy trying to bench press a heavy pine twig",
      "A medieval knight ordering bubble tea at a busy modern counter",
      "A chubby pigeon winning a gold medal at the Olympic games",
      "A samurai losing an intense argument to a loud angry goose",
      "An ancient red dragon working customer service on a tiny laptop",
      "A T-Rex trying online dating with its extremely short arms",
      "A cat wearing a business suit presenting a pie chart on fish",
      "A wizard using a magic staff to retrieve a lost sock from under a bed",
      "An alien trying to understand how a kitchen toaster works",
      "A grumpy potato starting a heavy metal rock band in a cellar",
      "A goldfish wearing a suit elected as the president of the ocean",
      "A sausage escaping a hungry fork on a tiny unicycle",
      "A dinosaur trying to apply mascara to its eyelashes",
      "A vacuum cleaner trying to suck up all the stars in the sky",
      "A giant head of broccoli trying to style its hair with a comb"
    ],
    situations: [
      "looking completely ridiculous and out of place", "sweating profusely and trying their absolute best", "screaming in absolute frustration",
      "while everyone around them acts completely normal", "under a shower of glittering star confetti", "with an expression of intense focus",
      "while wearing a tiny neon pink tutu", "in front of an audience of highly serious judges"
    ],
    environments: [
      "in the middle of a very quiet library", "on a live television broadcast room", "at a highly professional office board room",
      "in a crowded, modern city street subway", "inside a fancy, five-star restaurant dining room"
    ]
  },
  "Live & Simple Objects": {
    subjects: [
      "The mug or cup closest to you",
      "A set of keys resting on a surface",
      "The view outside your nearest window",
      "Your current footwear or bare feet",
      "A houseplant or leaf you can see",
      "A piece of fruit or a snack",
      "Your non-dominant hand",
      "Something made of glass nearby",
      "A chair or stool in the room",
      "A pen, pencil, or stationery item",
      "The light fixture or lamp above you",
      "An item of clothing draped over something",
      "Your phone charger or a cable coil",
      "A bag, backpack, or wallet",
      "A simple wooden spoon or kitchen tool",
      "An object that is colored bright blue",
      "Something metallic and reflective",
      "The texture of a nearby blanket or fabric",
      "A simple book stacked on a table",
      "A water bottle or thermos",
      "A nearby door handle or lock",
      "A pair of glasses or sunglasses"
    ],
    situations: [
      "drawn with continuous lines without lifting your pen",
      "reimagined as if it was 100 years old",
      "drawn using only hatching and shading",
      "incorporating a tiny cartoon face",
      "with wild, exaggerated shadows",
      "surrounded by a subtle magical glow",
      "as if it was a sacred relic",
      "using your non-dominant hand to sketch",
      "in exactly ten simple lines",
      "re-imagined in a retro comic book style",
      "with a small plant or vine growing out of it",
      "as if it was floating in zero gravity"
    ],
    environments: [
      "right in front of you",
      "sitting on your desk or table",
      "bathed in soft, warm indoor lighting",
      "against a minimal, clean background",
      "in the quiet room you are currently in",
      "resting on a wooden surface",
      "illuminated by a single light source"
    ]
  }
};

// Generates exactly 3150 unique prompts deterministically on load
function pregeneratePrompts(): Prompt[] {
  const prompts: Prompt[] = [];
  const seenTitles = new Set<string>();

  for (let i = 0; i < 3150; i++) {
    // 1 in every 7 prompts is Weekly Unhinged
    const isWeeklyUnhinged = (i + 1) % 7 === 0;
    let category = "";
    if (isWeeklyUnhinged) {
      category = "Weekly Unhinged";
    } else {
      const otherCategories = PROMPT_CATEGORIES.filter(c => c !== "Weekly Unhinged");
      const catIndex = Math.floor(i / 7) % otherCategories.length;
      category = otherCategories[catIndex];
    }

    const vocab = CATEGORY_VOCABULARY[category];
    const sLen = vocab.subjects.length;
    const siLen = vocab.situations.length;
    const eLen = vocab.environments.length;

    let sIdx = (i * 17 + 11) % sLen;
    let siIdx = (i * 23 + 19) % siLen;
    let eIdx = (i * 29 + 31) % eLen;

    let subject = vocab.subjects[sIdx];
    let situation = vocab.situations[siIdx];
    let environment = vocab.environments[eIdx];

    // Simpler prompt patterns to keep them concise yet high vibe
    let title = "";
    const pattern = i % 3;
    if (pattern === 0) {
      title = `${subject} ${situation}.`;
    } else if (pattern === 1) {
      title = `${subject} ${environment}.`;
    } else {
      title = `${subject}.`;
    }
    title = title.replace(/\s+/g, ' ').replace(/\.+/g, '.').trim();

    // Prevent duplicates
    let attempt = 0;
    while (seenTitles.has(title) && attempt < 100) {
      attempt++;
      sIdx = (sIdx + 1) % sLen;
      siIdx = (siIdx + 2) % siLen;
      eIdx = (eIdx + 3) % eLen;
      subject = vocab.subjects[sIdx];
      situation = vocab.situations[siIdx];
      environment = vocab.environments[eIdx];
      
      const p = (i + attempt) % 3;
      if (p === 0) {
        title = `${subject} ${situation}.`;
      } else if (p === 1) {
        title = `${subject} ${environment}.`;
      } else {
        title = `${subject}.`;
      }
      title = title.replace(/\s+/g, ' ').replace(/\.+/g, '.').trim();
    }

    seenTitles.add(title);

    const refIndex = i % REFERENCE_GALLERY.length;
    const ref = REFERENCE_GALLERY[refIndex];

    const simpleText = `Minimalist Line Study: ${subject}. Focus on a 3-minute contour outline with clean line weight.`;
    const creativeText = `Pinterest Whimsy: ${subject} ${situation} with cozy storybook details & botanical motifs.`;
    const artsyText = `Expressive Ink Wash: ${subject} with rich ink cross-hatching and fluid watercolor tones.`;
    const advancedText = `Atmospheric Masterpiece: ${subject} ${environment}, featuring a complete scene composition with ambient light.`;

    prompts.push({
      id: `prompt_${i}`,
      title,
      text: title, // Main default prompt
      category,
      referenceUrl: ref.imageUrl,
      referenceTitle: ref.title,
      referenceTip: ref.artistNote,
      options: {
        simple: {
          key: 'simple',
          label: 'Simple Sketch',
          badge: '🌿 Minimal & Quick',
          text: simpleText,
          description: '3-5 min warm-up focusing on clean outlines and essential silhouettes without heavy shading.'
        },
        creative: {
          key: 'creative',
          label: 'Creative Whimsy',
          badge: '🎨 Story & Detail',
          text: creativeText,
          description: 'Aesthetic Pinterest storybook style with whimsical botanical elements and playful textures.'
        },
        artsy: {
          key: 'artsy',
          label: 'Artsy Ink Wash',
          badge: '✒️ Ink & Contrast',
          text: artsyText,
          description: 'Focus on dramatic value contrast, cross-hatching, and fluid ink or watercolor washes.'
        },
        advanced: {
          key: 'advanced',
          label: 'Atmospheric Scene',
          badge: '🌌 Full Masterpiece',
          text: advancedText,
          description: 'Complete composition with background depth, environmental lighting, and detailed narrative.'
        }
      }
    });
  }

  return prompts;
}

export const ALL_PREGENERATED_PROMPTS: Prompt[] = pregeneratePrompts();

// Gets a deterministic prompt for any day index (0 to infinite)
export function getPromptForDay(dayIndex: number): Prompt {
  const index = Math.abs(dayIndex) % ALL_PREGENERATED_PROMPTS.length;
  return ALL_PREGENERATED_PROMPTS[index];
}

// Dynamic search across pre-generated database
export function searchPrompts(query: string, limit = 50): Prompt[] {
  const lowercaseQuery = query.toLowerCase();
  const matched: Prompt[] = [];

  for (const p of ALL_PREGENERATED_PROMPTS) {
    if (
      p.title.toLowerCase().includes(lowercaseQuery) ||
      p.text.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    ) {
      matched.push(p);
      if (matched.length >= limit) break;
    }
  }
  return matched;
}

// Encouraging messages for daily motivation without times or pressures
export const ENCOURAGING_MESSAGES = [
  "Done is better than perfect.",
  "Every line is progress.",
  "No rush. Let your mind wander.",
  "Let your hand explore the ink.",
  "No timer, no pressure. Just play.",
  "There are no mistakes, only unexpected paths.",
  "Take your time, enjoy the quiet rhythm.",
  "Draw it your way.",
  "Even a single stroke holds beauty.",
  "Your style is uniquely your own.",
  "Relax, take a deep breath, and sketch.",
  "The pen is a traveler, let it guide you."
];

export function getEncouragementForDay(dayIndex: number): string {
  const idx = Math.abs(dayIndex + 42) % ENCOURAGING_MESSAGES.length;
  return ENCOURAGING_MESSAGES[idx];
}

// Side Draw / Extra Prompts database
export const ANIMALS_LIST = [
  "chubby sparrow", "lazy kitten", "curious red fox", "sleepy otter", "tiny hedgehog",
  "majestic deer", "wise barn owl", "friendly tree frog", "jumping squirrel", "miniature snail",
  "plump bumblebee", "graceful koi fish", "dancing butterfly", "fluffy bunny", "happy puppy"
];

export const OBJECTS_LIST = [
  "ceramic mug", "antique key", "fountain pen", "pocket watch", "folded paper crane",
  "wooden clothespeg", "worn leather shoe", "shiny glass marble", "vintage matchbox", "silver teaspoon",
  "braided bookmark", "smooth river stone", "potted succulent", "brass safety pin", "half-eaten apple"
];

export const LIVE_THINGS_LIST = [
  "the closest chair", "your own hand", "the pattern on your shirt", "the view outside your window",
  "the charger cable on your desk", "the lamp or light bulb above", "your water bottle", "the keyboard or keys",
  "a houseplant or flower", "a book cover nearby", "something bright red in your room", "your coffee or tea cup"
];

export interface SidePrompt {
  id: string;
  item: string;
  type: 'object' | 'animal' | 'live';
  challenge: string;
}

export function generateRandomSidePrompt(): SidePrompt {
  const categories: ('object' | 'animal' | 'live')[] = ['object', 'animal', 'live'];
  const type = categories[Math.floor(Math.random() * categories.length)];
  
  let item = "";
  let challenge = "";
  
  if (type === 'animal') {
    item = ANIMALS_LIST[Math.floor(Math.random() * ANIMALS_LIST.length)];
    const challenges = [
      `Incorporate a ${item} hiding somewhere in your sketch.`,
      `Incorporate a ${item} wearing a tiny, fancy hat.`,
      `Incorporate a ${item} asleep on top of a giant object.`,
      `Draw a quick study of a ${item} in under 2 minutes.`,
      `Incorporate a friendly ${item} peeking out from the corner.`
    ];
    challenge = challenges[Math.floor(Math.random() * challenges.length)];
  } else if (type === 'live') {
    item = LIVE_THINGS_LIST[Math.floor(Math.random() * LIVE_THINGS_LIST.length)];
    const challenges = [
      `Look at ${item} in front of you and draw it exactly as it is, focusing on shadows.`,
      `Look at ${item} in front of you and draw it in a futuristic, sci-fi style.`,
      `Look at ${item} in front of you and incorporate it as a giant landmark in your drawing.`,
      `Look at ${item} in front of you and draw it using only continuous, unbroken lines.`
    ];
    challenge = challenges[Math.floor(Math.random() * challenges.length)];
  } else {
    item = OBJECTS_LIST[Math.floor(Math.random() * OBJECTS_LIST.length)];
    const challenges = [
      `Incorporate a ${item} transformed into a magical artifact.`,
      `Incorporate a ${item} sitting in a strange, unexpected environment.`,
      `Incorporate a ${item} that has roots or plants growing out of it.`,
      `Draw a ${item} but make it look like it's made of liquid water or glass.`,
      `Incorporate a ${item} with a small, adorable face on it.`
    ];
    challenge = challenges[Math.floor(Math.random() * challenges.length)];
  }
  
  const id = `side_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  return { id, item, type, challenge };
}

