export const DEFAULT_PRESET_TEMPLATES = [
  {
    key: 'fleuriste',
    name: 'Fleuriste',
    description: "Le produit doit rester identique a travers tous les plans. Seule la mise en scene change.",
    theme: 'editorial',
    basePrompt: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical colors, identical materials and identical surface details. Placed upright on a clean white surface, soft diffused natural light from the left, pure white background, product in full sharp focus with visible texture and edge definition, no support accessory, no hands, no text, no props, product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, fingers, face, person, watermark, text, logo, different product, altered shape, wrong colors, wrong materials, dark background, harsh shadows, support accessory',
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical colors, identical materials and identical surface details. Placed upright on a clean white surface, soft diffused natural light from the left, pure white background, product in full sharp focus with visible texture and edge definition, no support accessory, no hands, no text, no props, product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, logo, different product, altered shape, wrong colors, wrong materials, dark background, harsh shadows, support accessory',
        aspectRatio: '1:1',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Bouquet flottant',
        promptAddon: 'Money shot.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical colors, identical materials and identical surface details - do not alter or hallucinate any part of the product. The product floating mid-air against a pure white background with no surface contact, warm golden rim light from behind sculpting the outline, soft diffused shadow below suggesting weightlessness, product in sharp focus, background completely clean, no hands, no support visible, no text, editorial product photography, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, different product, altered shape, wrong colors, wrong materials, surface contact, support structure, dark background',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Petales figes en vol',
        promptAddon: 'Effet WOW.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical colors, identical materials and identical surface details - do not alter or hallucinate any part of the product. The product standing upright surrounded by suspended micro-elements or detached details matching the exact colors and textures of the reference product, frozen in motion at various distances and angles, pure white background, warm diffused studio light, each detail in sharp focus, no hands, no text, high-end editorial product photography, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, different product, wrong colors, altered shape, dark background, harsh shadows',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'caviste',
    name: 'Caviste',
    description: "Le produit, son packaging et ses details de marque doivent etre identiques dans chaque plan.",
    theme: 'premium',
    basePrompt: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical packaging design, identical label design, identical label text and identical material rendering. Product standing upright on a dark slate surface, soft directional studio light from the upper left creating a gentle highlight along the edges, dark charcoal background, full product in sharp focus, no additional props, no hands, no extra objects, no text added, product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, person, watermark, different product, different label, altered label text, invented label, hallucinated text, blurry label, additional products, props',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical packaging design, identical label design, identical label text and identical material rendering. Product standing upright on a dark slate surface, soft directional studio light from the upper left creating a gentle highlight along the edges, dark charcoal background, full product in sharp focus, no additional props, no hands, no extra objects, no text added, product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, different label, altered label text, invented label, hallucinated text, blurry label, additional products, props',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Levitation fond sombre',
        promptAddon: 'Money shot.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical packaging design, identical label design and identical label text fully preserved and legible - do not alter or hallucinate any part of the product or label. The product levitating vertically mid-air against a deep black background, two narrow rim lights on each side sculpting the silhouette, subtle reflection on a glossy surface below, no hands, no support structure visible, luxury editorial product photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, different label, altered label, invented text, blurry label, support structure, white background, props',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Accord mets et vins',
        promptAddon: 'Lifestyle.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical packaging design, identical label design and identical label text fully preserved and legible - do not alter or hallucinate any part of the product or label. The product placed on a dark slate board within a premium food editorial composition, overhead framing, soft warm light from above, no hands, no extra hero object competing with the product, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, different label, altered label, invented text, blurry label, cluttered composition, bright background',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'chocolatier',
    name: 'Chocolatier',
    description: "Le produit et ses details de matiere doivent rester identiques. Les plans d'effet derivent de la reference sans l'alterer.",
    theme: 'premium',
    basePrompt: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical colors, identical finish and identical arrangement of visible elements. Presented against a neutral warm-toned background, photographed from slightly above, soft diffused light from above with no harsh shadows, product in sharp focus with visible surface texture and sheen, no hands, no text added, no additional props, clean product photography, 50mm lens equivalent, photorealistic',
    negativePrompt: 'hands, fingers, face, person, watermark, different product, altered design, wrong colors, dark background, harsh shadows',
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical colors, identical finish and identical arrangement of visible elements. Presented against a neutral warm-toned background, photographed from slightly above, soft diffused light from above with no harsh shadows, product in sharp focus with visible surface texture and sheen, no hands, no text added, no additional props, clean product photography, 50mm lens equivalent, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, different product, altered design, wrong colors, dark background, harsh shadows',
        aspectRatio: '1:1',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Coulee chocolat freeze',
        promptAddon: 'Desir immediat.',
        promptOverride: 'A flowing stream of product material whose color and finish exactly match the product in the reference image, frozen perfectly mid-flow above a glossy dark surface, the material showing internal texture and rich tonal depth, a small frozen splash at the point of impact below, dramatic warm side lighting creating a highlight along the stream, deep dark background, no hands, no text, macro product photography, photorealistic',
        negativePrompt: 'hands, fingers, face, watermark, text, dirty surface, wrong product color, cartoon, blurry subject',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Cassure suspendue',
        promptAddon: 'Effet WOW.',
        promptOverride: 'A single fragment or unit of product whose color and finish exactly match the reference product, breaking apart with the parts frozen mid-separation in the air, fine debris and shards suspended around the break point showing the exact same texture as the reference, clean matte dark background, warm directional light from the side revealing the interior texture, no hands, no text, macro product photography, photorealistic',
        negativePrompt: 'hands, fingers, face, watermark, text, wrong product color, dirty surface, cartoon, blurry subject',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'epicerie-fine',
    name: 'Épicerie fine',
    description: "Le produit phare doit conserver son etiquette, sa forme et sa matiere exactes dans chaque plan.",
    theme: 'commerce',
    basePrompt: 'The exact product from the reference image, reproduced with identical shape, identical packaging design, identical label design, identical label text and typography, identical colors and materials. Placed on a light natural wood surface, soft natural window light from the left, clean white or light beige background, product in full sharp focus showing label texture and detail, no hands, no additional props, honest product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, person, watermark, different product, different label, altered label text, invented label, hallucinated text, plastic packaging, dark background, supermarket products',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact product from the reference image, reproduced with identical shape, identical packaging design, identical label design, identical label text and typography, identical colors and materials. Placed on a light natural wood surface, soft natural window light from the left, clean white or light beige background, product in full sharp focus showing label texture and detail, no hands, no additional props, honest product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, different label, altered label text, invented label, hallucinated text, plastic packaging, dark background, supermarket products',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Coulee doree freeze backlit',
        promptAddon: 'Money shot.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical packaging design, identical label design and identical label text fully preserved - do not alter or hallucinate any part of the product or label. A premium close-up composition with the product material highlighted in a luminous backlit scene, color and texture matching the exact product in the reference image, light natural surface below, clean light background, no hands, no text, macro editorial product photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, different label, altered label, invented text, dark background, artificial colors',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: "Overhead table d'abondance",
        promptAddon: 'Art de vivre.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical packaging design, identical label design and identical label text fully preserved and legible - do not alter or hallucinate any part of the product or label. The product placed at the center of a flat lay overhead composition on a white marble surface, surrounded by complementary artisan items and a natural linen napkin, warm diffused natural light from above, generous negative space between items, no hands, no text, lifestyle editorial product photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, altered label, invented text, plastic packaging, supermarket products, cluttered composition, dark background',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'parfumeur',
    name: 'Parfumeur',
    description: "Le produit est un objet a forte identite visuelle. Sa forme, sa matiere et son packaging doivent etre preserves.",
    theme: 'premium',
    basePrompt: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical packaging design, identical material rendering and identical color accents. Standing upright on a clean reflective white surface, soft diffused studio light from slightly above and to the left, white background, product in complete sharp focus showing material clarity and fine detail, subtle clean reflection on the surface below, no hands, no text, no props, luxury product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, person, watermark, different product, altered shape, invented design, dark background, props, text',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact product from the reference image, reproduced with identical shape, identical proportions, identical packaging design, identical material rendering and identical color accents. Standing upright on a clean reflective white surface, soft diffused studio light from slightly above and to the left, white background, product in complete sharp focus showing material clarity and fine detail, subtle clean reflection on the surface below, no hands, no text, no props, luxury product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, altered shape, invented design, dark background, props, text',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Levitation fond velours',
        promptAddon: 'Prestige.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical packaging design, identical material rendering and identical color accents fully preserved - do not alter or hallucinate any part of the product. The product floating vertically mid-air against a deep black velvet background, narrow rim lights on both sides creating a thin luminous edge along the silhouette, perfectly clean surface reflection below, no hands, no support structure visible, no text, ultra sharp, luxury editorial product photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, altered shape, support structure, white background, props, text',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Mist freeze',
        promptAddon: 'Effet unique.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical packaging design, identical material rendering and identical color accents fully preserved - do not alter or hallucinate any part of the product. A fine mist of micro-droplets frozen mid-air around and above the product, individual droplets catching a soft backlight and creating a luminous halo, dark background, product itself in sharp focus, mist cloud slightly soft and ethereal, no nozzle visible, no hands, no text, luxury campaign product photography, photorealistic',
        negativePrompt: 'hands, nozzle, face, person, watermark, different product, altered shape, white background, text, harsh light',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-04',
        name: 'Ingredients botaniques',
        promptAddon: 'Storytelling.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical packaging design, identical material rendering and identical color accents fully preserved - do not alter or hallucinate any part of the product. The product placed at the center of a composed arrangement of premium raw ingredients on a dark stone surface, soft warm directional light from above casting gentle shadows, product in sharp focus, surrounding elements slightly softer, no hands, no text, luxury editorial product photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, altered shape, white background, text, cluttered composition',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'universel-editorial',
    name: 'Universel editorial',
    description: "Famille universelle pour produits du quotidien, avec un plan lifestyle contextuel, un plan studio sobre et un plan explosion en apesanteur.",
    theme: 'custom',
    basePrompt: 'The exact same product as in the reference image, with identical shape, identical design, identical colors, identical text and markings fully preserved - do not alter or hallucinate any part of the product. The product placed in a styled flat lay composition on a surface that matches the natural world of this product. Identify what this product is, who uses it, and in what context - then choose surrounding props, materials, textures and atmosphere that are authentically coherent with that world. Props should feel like they naturally coexist with this product in real life. Soft directional natural light, clean composition with breathing space between elements, no hands, no text added, no branding on props, lifestyle editorial photography, photorealistic',
    negativePrompt: 'hands, fingers, face, person, watermark, text added, branding on props, different product, altered shape, altered design, wrong colors, altered label, invented text, hallucinated markings, support structure, cluttered composition',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Flat lay contextuel',
        promptAddon: 'Plan maitre universel.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical design, identical colors, identical text and markings fully preserved - do not alter or hallucinate any part of the product. The product placed in a styled flat lay composition on a surface that matches the natural world of this product. Identify what this product is, who uses it, and in what context - then choose surrounding props, materials, textures and atmosphere that are authentically coherent with that world. Props should feel like they naturally coexist with this product in real life. Soft directional natural light, clean composition with breathing space between elements, no hands, no text added, no branding on props, lifestyle editorial photography, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text added, branding on props, different product, altered shape, altered design, wrong colors, altered label, invented text, hallucinated markings, support structure, cluttered composition',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Studio sobre',
        promptAddon: 'Plan produit epure et rassurant.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical design, identical colors, identical text and markings fully preserved - do not alter or hallucinate any part of the product. The product placed on a clean surface with soft diffused studio light from slightly above and to the left, neutral background, product in complete sharp focus showing every detail of its material, texture and finish, subtle clean reflection on the surface below, no hands, no text added, no props, product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text added, branding on props, different product, altered shape, altered design, wrong colors, altered label, invented text, hallucinated markings, support structure, cluttered composition',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Explosion apesanteur',
        promptAddon: 'Plan campagne dramatique.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical design, identical colors, identical text and markings fully preserved - do not alter or hallucinate any part of the product. The product suspended mid-air as if weightless, slightly tilted, label facing camera. Identify what this product contains or is made of - then generate floating elements around it that are physically coherent with its contents or function: liquid droplets, ingredients, particles, sparks, smoke or material fragments matching the product\'s nature. Elements frozen mid-air in all directions around the product, dark background, dramatic rim lighting, no hands, no surface contact, photorealistic, editorial campaign photography',
        negativePrompt: 'hands, fingers, face, person, watermark, text added, branding on props, different product, altered shape, altered design, wrong colors, altered label, invented text, hallucinated markings, surface contact, visible support structure, bright background',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'luxe-pinterest',
    name: 'Luxe Pinterest',
    description: "Pinterest editorial premium en 3 plans : hero universel, bouteille couchee vue de haut, puis verres desires au premier plan.",
    theme: 'premium',
    basePrompt: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Create a single luxurious Pinterest-editorial lifestyle image with strong art direction, choosing a decor and styling that are naturally appropriate for this exact product category. First infer what the product is, who buys it, when it is used, and what premium world it belongs to. Then build a coherent scene around it using only refined props, surfaces and background elements that genuinely fit that world: sunlit stone, travertine, terracotta, artisan ceramics, linen, wood, sand, tropical fruit, glassware, resort details, Mediterranean textures, sculptural objects or elegant leisure cues when relevant. Composition must follow the visual proportions of premium Pinterest campaign imagery: portrait framing, layered foreground-midground-background depth, the product large enough to feel hero but never filling the frame, usually occupying around one quarter to one third of the image area, with breathing space around it. Leave elegant negative space, allow some secondary props or body fragments to be partially cropped by the frame edges, and avoid catalog-style centering. Favor placement in the lower-middle or central third with surrounding decor extending beyond the frame so the scene feels like a captured moment inside a larger world. Prefer warm direct sunlight with crisp graphic shadows, rich tactile textures, elevated color harmony and a polished luxury campaign feeling. If human presence makes the scene more desirable and coherent, allow only a cropped body fragment such as a hand, forearm, shoulder or torso fragment, never a face and never a full person. No added text, no branding on props, photorealistic.',
    negativePrompt: 'different product, altered shape, altered proportions, altered design, wrong colors, wrong materials, altered label, altered packaging, invented text, hallucinated markings, watermark, cheap props, supermarket styling, cluttered composition, support structure, low-end packaging, cartoon look, CGI look, blurry product, face, full person, crowd, irrelevant props, corporate studio background, product too small in frame, product filling the whole frame, centered catalog shot, empty dead background, flat composition',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Scene universelle Pinterest',
        promptAddon: 'Une seule variante universelle. Le decor doit s adapter intelligemment au produit.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Create one premium Pinterest-editorial hero scene tailored specifically to this product. Infer its ideal luxury context from the product itself, then choose a decor, placement, props, surfaces and atmosphere that feel naturally associated with its premium lifestyle world. The visual language should draw from sunlit luxury references: warm direct sunlight, strong elegant shadows, tactile premium materials, resort or Mediterranean influences when relevant, artisan objects, sculptural styling, refined table elements, fruit or ingredient cues, stone, terracotta, linen, sand, wood, water reflections or architectural textures only when coherent with the product. Match the framing logic of high-performing Pinterest luxury still lifes: use portrait composition, build depth in layers, keep the product as the dominant hero while letting it occupy roughly one quarter to one third of the frame instead of filling it, preserve breathing room around the object, and let some secondary elements be partially cropped by the image edges. Position the hero product in a visually intentional way - often slightly below center, in the lower middle third, or anchored centrally with generous headroom - so the surrounding environment feels editorial and expansive. The scene should feel desirable but believable, polished yet natural, never like a sterile packshot. If a human element improves realism, include only a cropped body fragment and never a face or full person. No added text, no branding on props, photorealistic.',
        negativePrompt: 'different product, altered shape, altered proportions, altered design, wrong colors, wrong materials, altered label, altered packaging, invented text, hallucinated markings, cheap props, supermarket styling, cluttered composition, visible support, face, full person, crowd, watermark, irrelevant props, sterile corporate studio, product too small in frame, product filling the whole frame, centered catalog shot, empty dead background, flat composition',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Bouteille couchee art de vivre',
        promptAddon: 'Bouteille couchée, photo prise du dessus, flat lay chargé et premium avec plusieurs verres.',
        promptOverride: 'The exact same bottle or packaged product as in the reference image, with identical shape, identical proportions, identical colors, identical materials, identical packaging details, identical label design and identical text fully preserved and legible - do not alter or hallucinate any part of the product. Restage the product lying down flat on the surface, photographed clearly from above in an overhead flat-lay composition. The bottle should rest horizontally or on a soft diagonal across the scene, never upright. Build a richer Pinterest-editorial arrangement around it with coherent premium elements distributed across the surface: multiple glasses, fruit cuts, garnishes, textiles, ceramics, coasters, serving tools, trays, leisure details or artisanal objects that genuinely match the bottle universe. Match the visual proportions of the references: the bottle is prominent and readable but not oversized, usually occupying about one quarter to one third of the frame, while the surrounding decor fills the rest of the composition in a controlled but abundant way. The styling should feel sunlit, summery, tactile and desirable, with several objects partially cropped by the frame edges so the image feels like a real captured moment instead of a centered catalog shot. Use warm direct sunlight, crisp graphic shadows, premium textures, and a clearly top-down point of view across the whole scene, photorealistic.',
        negativePrompt: 'upright bottle, eye-level shot, frontal shot, perspective side view, isolated packshot, empty scene, cheap party props, supermarket styling, plastic clutter, face, full person, crowd, altered label, invented text, wrong bottle shape, blurry glasses, irrelevant objects, sterile corporate studio, sparse decor, flat generic styling',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Verres desir premier plan',
        promptAddon: 'Les verres remplis et decorés sont au premier plan, la bouteille et l univers soutiennent en fond.',
        promptOverride: 'The exact same bottle or packaged product as in the reference image, with identical shape, identical proportions, identical colors, identical materials, identical packaging details, identical label design and identical text fully preserved and legible - do not alter or hallucinate any part of the product. Create a Pinterest-editorial composition where one or several filled glasses are the foreground heroes, styled according to the exact bottle universe: correct drink color, coherent garnish, rim treatment, fruit, herbs, ice, foam or texture inspired by what the product naturally suggests. The glasses should occupy the front plane prominently, large and seductive, while the bottle appears in the midground or background as a supporting anchor, still recognizable and elegant. Add an immersive decor behind and around them - fruit, bowls, tiles, wood, stone, linen, resort details, serving accessories or atmosphere cues - chosen to match the bottle identity. Follow the visual proportions of premium references: the nearest glass should feel big in frame, the bottle secondary and partially set back, with layered depth and some peripheral objects softly cropped by the edges. Slightly elevated camera angle, not straight-on, warm direct sunlight, crisp highlights and shadows, premium tactile surfaces, photorealistic luxury Pinterest lifestyle photography.',
        negativePrompt: 'empty glasses, bottle as sole hero, incorrect drink color, irrelevant garnish, cheap bar scene, nightclub look, face, full person, crowd, altered label, invented text, wrong bottle shape, flat composition, sterile studio',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'editorial-overlay',
    name: 'Editorial Overlay',
    description: "Campagne epuree et stylisee avec vraie zone vide pour texte, univers adapte au produit fourni.",
    theme: 'premium',
    basePrompt: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Create a clean, stylized premium editorial campaign image designed to leave intentional space for text overlay. First infer what the product is, who it is for, what premium world it belongs to, and what minimal decor language best supports it. Build a refined scene with a strong visual hierarchy: the hero product or its most natural styled use anchored in the lower half or lower third of the frame, with a large clean negative-space area reserved in the upper area or on one side for future copy. Use a simple tonal background, subtle texture, controlled gradients, sculptural blocks, elegant surfaces or one to three coherent props only when relevant to the product. The image must feel polished, branded and campaign-ready, not empty and not cluttered. Prefer one dominant color world, deliberate spacing, premium materials, and directional light that creates graceful shadows without filling the copy space with noise. Photorealistic.',
    negativePrompt: 'different product, altered shape, altered proportions, altered design, wrong colors, wrong materials, altered label, altered packaging, invented text, hallucinated markings, watermark, cluttered composition, busy patterned background, crowded props, cheap props, supermarket styling, no negative space, copy space blocked, centered catalog shot, flat composition, corporate studio packshot, cartoon look, CGI look, face, full person, crowd',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Campagne epuree avec texte',
        promptAddon: 'Image stylisee et suffisamment degagee pour ajouter un overlay texte.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Create one polished editorial campaign visual with intentional copy space. Infer the ideal premium universe from the product itself, then stage it in a minimal but expressive decor that feels custom to that category. Follow the composition logic of the provided references: keep the hero anchored in the lower half, often on a pedestal, block, tray, tabletop or grounded surface; let the product and supporting styled use occupy roughly one quarter to one third of the frame; and preserve a large calm area in the upper third to upper half, or along one side, with smooth background texture suitable for text overlay. The set should feel stylized rather than generic: one dominant color family, controlled sculptural props, elegant material surfaces, and only a few supporting elements that clarify the universe without clutter. If the product is a bottle, drink, edible item, fragrance or similar lifestyle object, you may include one coherent styled serving, glass, garnish, ingredient or usage cue, but the actual product must stay visible, readable and premium. Lighting should be directional and graphic yet refined, with shadows used to add depth while keeping the text zone clean and usable. Photorealistic, campaign-ready, elevated and spacious.',
        negativePrompt: 'different product, altered shape, altered proportions, altered design, wrong colors, wrong materials, altered label, altered packaging, invented text, hallucinated markings, busy layout, clutter, too many props, product filling the whole frame, product too small, no copy space, blocked text zone, noisy background, centered packshot, flat composition, cheap materials, face, full person, crowd, watermark',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
    ],
  },
  {
    key: 'nouveau-produit',
    name: 'Nouveau Produit',
    description: "Serie de lancement premium en 2 plans, ou le produit est la star absolue et tout l'univers visuel est construit a partir de lui.",
    theme: 'premium',
    basePrompt: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical label design and identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Create a premium new-product launch visual where this product is unquestionably the hero and every decor choice exists only to support it. First infer what the product is, who desires it, what category world it belongs to, and which colors, materials, ingredients, rituals or usage cues are naturally connected to it. Build the entire scene from that logic only: surfaces, props, textures, architecture, ingredients and atmosphere must feel derived from the product itself, never generic or random. Keep the hero product dominant, highly readable and visually celebrated, usually occupying around one quarter to one third of the frame, with layered depth, controlled negative space, refined premium lighting and campaign-level realism. No added text, no branding on props, no competing hero object, photorealistic.',
    negativePrompt: 'different product, altered shape, altered proportions, altered design, wrong colors, wrong materials, altered label, altered packaging, invented text, hallucinated markings, watermark, generic props, irrelevant decor, cluttered composition, product too small, product hidden by props, competing hero object, support structure, cheap styling, supermarket look, flat lighting, cartoon look, CGI look, face, full person, crowd',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Hero lancement',
        promptAddon: 'Plan maitre. Le produit est la star, l univers entier se construit autour de lui.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical label design and identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Create a premium new-product launch still life with the product as the undisputed hero. Study the product category and build a restrained editorial composition around it using only a few coherent support elements derived from its own world: one sculptural base, tray, crate, stone block or textured support, plus two to four secondary accents such as ingredients, serving cues or material fragments. The composition must feel highly art directed and spacious, not crowded: portrait framing, product occupying roughly one quarter to one third of the frame height, positioned centrally or slightly lower-center, with generous negative space above and around it. Keep the product the largest, sharpest and most readable element. Supporting objects must feel intentional, balanced and premium, often grouped tightly around the base rather than scattered across the frame. Favor tonal backgrounds, muted but rich color harmony, tactile materials, crisp studio light, clean shadow control and a believable grounded set. No added text, no branding on props, photorealistic.',
        negativePrompt: 'different product, altered shape, altered proportions, altered design, wrong colors, wrong materials, altered label, altered packaging, invented text, hallucinated markings, cluttered scene, too many props, scattered props, generic props, irrelevant decor, centered catalog packshot, product too small, product hidden, competing hero object, cheap styling, supermarket look, face, full person, crowd, watermark',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Reveal sculptural',
        promptAddon: 'Mise en scene graphique et architecturale. Le decor revele le produit au lieu de le concurrencer.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical label design and identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Build a sculptural reveal image where the set is designed specifically to frame and reveal the product: a carved niche, layered aperture, mineral fissure, monolithic cut-out or architectural silhouette whose form, color and texture are directly inspired by the product. The product must remain dominant, isolated and instantly readable, usually centered and large in frame, with the reveal structure wrapping around it or opening behind it to create a strong halo, window or silhouette effect. Keep the scene minimal and graphic: one dominant reveal device, one clear color world, very few or no extra props, and only small grounded material cues when they genuinely strengthen the story. Favor bold shape language, clean edges, premium surface texture, controlled contrast, precise shadow design and campaign-level lighting. Avoid generic decor and avoid busy storytelling; the power must come from the sculptural framing and the product silhouette itself. No added text, no branding on props, no competing hero object, photorealistic.',
        negativePrompt: 'different product, altered shape, altered label, invented text, random architecture, irrelevant props, clutter, busy background, weak silhouette, product too small, product obscured, too many props, multiple reveal devices, messy set design, support structure, cheap materials, face, full person, crowd, watermark',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'mamadou',
    name: 'MAMADOU',
    description: "Preset hybride en 3 plans : flat lay contextuel, hero lancement, puis verres desir au premier plan.",
    theme: 'premium',
    basePrompt: 'The exact same product as in the reference image, with identical shape, identical design, identical colors, identical text and markings fully preserved - do not alter or hallucinate any part of the product. The product placed in a styled flat lay composition on a surface that matches the natural world of this product. Identify what this product is, who uses it, and in what context - then choose surrounding props, materials, textures and atmosphere that are authentically coherent with that world. Props should feel like they naturally coexist with this product in real life. Soft directional natural light, clean composition with breathing space between elements, no hands, no text added, no branding on props, lifestyle editorial photography, photorealistic',
    negativePrompt: 'hands, fingers, face, person, watermark, text added, branding on props, different product, altered shape, altered design, wrong colors, altered label, invented text, hallucinated markings, support structure, cluttered composition',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Flat lay contextuel',
        promptAddon: 'Plan maitre universel.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical design, identical colors, identical text and markings fully preserved - do not alter or hallucinate any part of the product. The product placed in a styled flat lay composition on a surface that matches the natural world of this product. Identify what this product is, who uses it, and in what context - then choose surrounding props, materials, textures and atmosphere that are authentically coherent with that world. Props should feel like they naturally coexist with this product in real life. Soft directional natural light, clean composition with breathing space between elements, no hands, no text added, no branding on props, lifestyle editorial photography, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text added, branding on props, different product, altered shape, altered design, wrong colors, altered label, invented text, hallucinated markings, support structure, cluttered composition',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Hero lancement',
        promptAddon: 'Plan maitre. Le produit est la star, l univers entier se construit autour de lui.',
        promptOverride: 'The exact same product as in the reference image, with identical shape, identical proportions, identical design, identical colors, identical materials, identical packaging details, identical label design and identical text and markings fully preserved and legible - do not alter or hallucinate any part of the product. Create a premium new-product launch still life with the product as the undisputed hero. Study the product category and build a restrained editorial composition around it using only a few coherent support elements derived from its own world: one sculptural base, tray, crate, stone block or textured support, plus two to four secondary accents such as ingredients, serving cues or material fragments. The composition must feel highly art directed and spacious, not crowded: portrait framing, product occupying roughly one quarter to one third of the frame height, positioned centrally or slightly lower-center, with generous negative space above and around it. Keep the product the largest, sharpest and most readable element. Supporting objects must feel intentional, balanced and premium, often grouped tightly around the base rather than scattered across the frame. Favor tonal backgrounds, muted but rich color harmony, tactile materials, crisp studio light, clean shadow control and a believable grounded set. No added text, no branding on props, photorealistic.',
        negativePrompt: 'different product, altered shape, altered proportions, altered design, wrong colors, wrong materials, altered label, altered packaging, invented text, hallucinated markings, cluttered scene, too many props, scattered props, generic props, irrelevant decor, centered catalog packshot, product too small, product hidden, competing hero object, cheap styling, supermarket look, face, full person, crowd, watermark',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Verres desir premier plan',
        promptAddon: 'Les verres remplis et decorés sont au premier plan, la bouteille et l univers soutiennent en fond.',
        promptOverride: 'The exact same bottle or packaged product as in the reference image, with identical shape, identical proportions, identical colors, identical materials, identical packaging details, identical label design and identical text fully preserved and legible - do not alter or hallucinate any part of the product. Create a Pinterest-editorial composition where one or several filled glasses are the foreground heroes, styled according to the exact bottle universe: correct drink color, coherent garnish, rim treatment, fruit, herbs, ice, foam or texture inspired by what the product naturally suggests. The glasses should occupy the front plane prominently, large and seductive, while the bottle appears in the midground or background as a supporting anchor, still recognizable and elegant. Add an immersive decor behind and around them - fruit, bowls, tiles, wood, stone, linen, resort details, serving accessories or atmosphere cues - chosen to match the bottle identity. Follow the visual proportions of premium references: the nearest glass should feel big in frame, the bottle secondary and partially set back, with layered depth and some peripheral objects softly cropped by the edges. Slightly elevated camera angle, not straight-on, warm direct sunlight, crisp highlights and shadows, premium tactile surfaces, photorealistic luxury Pinterest lifestyle photography.',
        negativePrompt: 'empty glasses, bottle as sole hero, incorrect drink color, irrelevant garnish, cheap bar scene, nightclub look, face, full person, crowd, altered label, invented text, wrong bottle shape, flat composition, sterile studio',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'joaillerie-desir',
    name: 'Joaillerie desir',
    description: "Famille joaillerie en 4 plans : comprehension, preuve de qualite, projection portee et desir d'offrir.",
    theme: 'premium',
    basePrompt: 'The exact same jewelry piece as in the reference image, with identical shape, identical metal color and finish, identical gemstone color and cut, identical proportions and every detail fully preserved - do not alter or hallucinate any part of the piece.',
    negativePrompt: 'hands, fingers, face, person, watermark, text, different jewelry, altered design, wrong metal color, wrong gemstone color, blurry stone, harsh shadows',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: "C'est quoi exactement ?",
        promptAddon: 'Studio epure. Ancre fidele au reel, a generer en premier.',
        promptOverride: 'The exact same jewelry piece as in the reference image, with identical shape, identical metal color and finish, identical gemstone color and cut, identical proportions and every detail fully preserved - do not alter or hallucinate any part of the piece. The jewelry piece placed flat or propped on a clean pure white surface, soft diffused light from slightly above and to the left creating subtle highlights along the metal edges, pure white background, piece in complete sharp focus showing metal texture, stone facets and surface finish, subtle clean reflection on the surface below, no hands, no props, no text, luxury jewelry product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, different jewelry, altered design, dark background, props, velvet box visible, harsh shadows, blurry stone, wrong metal color',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: "C'est vraiment de qualite ?",
        promptAddon: 'Macro matiere extreme. Qualite visible, justifie le prix sans un mot.',
        promptOverride: 'The exact same jewelry piece as in the reference image, with identical metal color and finish, identical gemstone color and cut fully preserved - do not alter any detail. Extreme macro shot of the most detailed part of the piece, filling the entire frame, the metal surface showing its texture and micro-finish in complete sharp focus, gemstone facets refracting light into internal reflections and sparkle, razor thin depth of field with soft bokeh background, cold precise directional light from the side creating crisp highlights along metal edges, pure white or very dark background, no hands, no text, ultra macro luxury jewelry photography, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, full piece visible, wide shot, blurry stone, wrong metal color, wrong gemstone color, dirty surface, scratches',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: "Est-ce que ca m'ira ?",
        promptAddon: "Porte sur fragment de corps. Desir d'identification.",
        promptOverride: "The exact same jewelry piece as in the reference image, with identical metal color and finish, identical gemstone color and cut fully preserved - do not alter any detail. The jewelry piece worn on a single body fragment - a wrist for a bracelet or watch, a bare neckline for a necklace, an earlobe for earrings, a single finger detail for a ring - never show a full hand, never show a face. Skin is smooth, neutral and naturally lit, soft warm light from the side making the metal catch the light against the skin, the jewelry is the single sharp focal point, background completely blurred into soft neutral bokeh, no face, no full hand, no text, luxury jewelry editorial photography, photorealistic",
        negativePrompt: "full hand, all fingers visible, face, person's face, watermark, text, wrong metal color, wrong gemstone, busy background, harsh light, multiple pieces, different jewelry",
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-04',
        name: "Est-ce que j'ai envie de l'offrir ou de le recevoir ?",
        promptAddon: "Mise en scene desir. Emotion, vend l'acte d'offrir ou de recevoir.",
        promptOverride: "The exact same jewelry piece as in the reference image, with identical metal color and finish, identical gemstone color and cut fully preserved - do not alter any detail. The jewelry piece placed at the center of a carefully composed flat lay on a dark velvet or aged leather surface, surrounded by props that evoke the emotion of giving or receiving a precious gift: a folded silk ribbon, a small wax sealed envelope, dried rose petals matching the metal tone, an open luxury jewelry box slightly out of focus in the background. Soft warm directional light from above, generous negative space around the piece, jewelry in sharp focus, props slightly softer, no hands, no text, no branding on props, luxury jewelry lifestyle editorial photography, photorealistic",
        negativePrompt: 'hands, fingers, face, person, watermark, text, branding on props, plastic box, cheap materials, bright white background, harsh light, cluttered composition, wrong metal color, wrong gemstone color',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
];

const ACTIVE_DEFAULT_PRESET_KEYS = new Set([
  'universel-editorial',
  'luxe-pinterest',
  'editorial-overlay',
  'nouveau-produit',
  'mamadou',
  'joaillerie-desir',
]);

export function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export function getJsonBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    throw new Error('Body JSON invalide');
  }
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} non configurée`);
  }

  return value;
}

function generateId(prefix) {
  return `${prefix}_${globalThis.crypto.randomUUID()}`;
}

export async function kieRequest(path, { method = 'GET', body } = {}) {
  const apiKey = requireEnv('KIEAI_API_KEY');
  const response = await fetch(`https://api.kie.ai/api/v1/jobs/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.msg || `Erreur KIE AI (${response.status})`);
  }

  return payload;
}

export async function uploadToKieBase64(imageBase64, fileName = 'photo.jpg') {
  const apiKey = requireEnv('KIEAI_API_KEY');
  const fileContent = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const response = await fetch('https://kieai.redpandaai.co/api/file-base64-upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Data: fileContent,
      fileName,
      uploadPath: 'images',
    }),
  });

  const payload = await response.json().catch(() => null);

  const uploadedUrl = payload?.data?.fileUrl || payload?.data?.downloadUrl;

  if (!response.ok || payload?.code !== 200 || !uploadedUrl) {
    throw new Error(payload?.msg || "Upload de l'image vers KIE échoué");
  }

  return uploadedUrl;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!url) {
    throw new Error('SUPABASE_URL non configurée');
  }

  return { url, serviceRoleKey };
}

export async function supabaseRequest(path, { method = 'GET', body, prefer } = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    if (Array.isArray(payload) && payload[0]?.message) {
      throw new Error(payload[0].message);
    }

    throw new Error(payload?.message || payload?.error_description || payload || `Erreur Supabase (${response.status})`);
  }

  return payload;
}

function encodeFilter(value) {
  return encodeURIComponent(value);
}

function sanitizeText(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizeOutputFormat(value, fallback = 'png') {
  const normalized = sanitizeText(value, fallback).toLowerCase();
  return ['png', 'jpg', 'webp'].includes(normalized) ? normalized : fallback;
}

function normalizeAspectRatio(value, fallback = '1:1') {
  const normalized = sanitizeText(value, fallback).toLowerCase();
  return ['auto', '1:1', '4:5', '9:16', '16:9'].includes(normalized) ? normalized : fallback;
}

function normalizeVariantInput(variant, index, presetAspectRatio) {
  const name = sanitizeText(variant?.name, `Variante ${index + 1}`);

  return {
    id: sanitizeText(variant?.id, generateId('variant')),
    name,
    promptAddon: sanitizeText(variant?.promptAddon),
    promptOverride: sanitizeText(variant?.promptOverride),
    negativePrompt: sanitizeText(variant?.negativePrompt),
    aspectRatio: normalizeAspectRatio(variant?.aspectRatio, presetAspectRatio || '1:1'),
    enabledByDefault: Boolean(variant?.enabledByDefault),
    isMaster: Boolean(variant?.isMaster),
    sourceMode: sanitizeText(variant?.sourceMode, 'master') === 'source' ? 'source' : 'master',
  };
}

function normalizePresetInput(input, { fallbackId, clientId } = {}) {
  const aspectRatio = normalizeAspectRatio(input?.aspectRatio, '1:1');
  const variants = Array.isArray(input?.variants) ? input.variants : [];

  const normalizedVariants = variants.length > 0
    ? variants.map((variant, index) => normalizeVariantInput(variant, index, aspectRatio))
    : [normalizeVariantInput({ name: 'Vue principale', promptAddon: '', isMaster: true, sourceMode: 'source' }, 0, aspectRatio)];

  if (!normalizedVariants.some((variant) => variant.isMaster)) {
    normalizedVariants[0].isMaster = true;
  }

  normalizedVariants.forEach((variant) => {
    if (variant.isMaster) {
      variant.sourceMode = 'source';
    }
  });

  return {
    id: sanitizeText(input?.id, fallbackId || generateId('preset')),
    client_id: clientId,
    name: sanitizeText(input?.name, 'Nouveau preset'),
    description: sanitizeText(input?.description),
    theme: sanitizeText(input?.theme, 'custom'),
    base_prompt: sanitizeText(input?.basePrompt, 'Professional product photography, realistic, preserve the exact product details.'),
    negative_prompt: sanitizeText(input?.negativePrompt),
    aspect_ratio: aspectRatio,
    resolution: sanitizeText(input?.resolution, '1K'),
    output_format: normalizeOutputFormat(input?.outputFormat, 'png'),
    variants: normalizedVariants,
    updated_at: new Date().toISOString(),
  };
}

function createDefaultPresetRows(clientId) {
  return DEFAULT_PRESET_TEMPLATES
    .filter((template) => ACTIVE_DEFAULT_PRESET_KEYS.has(template.key))
    .map((template) => normalizePresetInput({
    id: `${clientId}_${template.key}`,
    name: template.name,
    description: template.description,
    theme: template.theme,
    basePrompt: template.basePrompt,
    negativePrompt: template.negativePrompt,
    aspectRatio: template.aspectRatio,
    resolution: template.resolution,
    outputFormat: template.outputFormat,
    variants: template.variants.map((variant) => ({
      id: `${clientId}_${template.key}_${variant.key}`,
      name: variant.name,
      promptAddon: variant.promptAddon,
      promptOverride: variant.promptOverride,
      negativePrompt: variant.negativePrompt,
      aspectRatio: variant.aspectRatio,
      enabledByDefault: variant.enabledByDefault,
      isMaster: variant.isMaster,
      sourceMode: variant.sourceMode,
    })),
  }, { clientId }));
}

export function toPresetItem(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    theme: row.theme || 'custom',
    basePrompt: row.base_prompt,
    negativePrompt: row.negative_prompt || '',
    aspectRatio: normalizeAspectRatio(row.aspect_ratio, '1:1'),
    resolution: row.resolution || '1K',
    outputFormat: normalizeOutputFormat(row.output_format, 'png'),
    variants: Array.isArray(row.variants) ? row.variants.map((variant, index) => normalizeVariantInput(variant, index, row.aspect_ratio)) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function syncDefaultPresets(clientId, existingRows = []) {
  const rows = createDefaultPresetRows(clientId);
  const managedIds = new Set(rows.map((row) => row.id));
  const staleRows = (Array.isArray(existingRows) ? existingRows : []).filter((row) => (
    typeof row?.id === 'string'
    && row.id.startsWith(`${clientId}_`)
    && !managedIds.has(row.id)
  ));

  await supabaseRequest('flash_presets', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=minimal',
    body: rows,
  });

  if (staleRows.length > 0) {
    await Promise.all(staleRows.map((row) => supabaseRequest(
      `flash_presets?id=eq.${encodeFilter(row.id)}&client_id=eq.${encodeFilter(clientId)}`,
      {
        method: 'DELETE',
        prefer: 'return=minimal',
      },
    )));
  }

  return rows.length > 0;
}

export async function listPresets(clientId) {
  if (!clientId) {
    throw new Error('clientId manquant');
  }

  let rows = await supabaseRequest(
    `flash_presets?client_id=eq.${encodeFilter(clientId)}&select=id,name,description,theme,base_prompt,negative_prompt,aspect_ratio,resolution,output_format,variants,created_at,updated_at&order=created_at.asc`,
  );

  const insertedDefaults = await syncDefaultPresets(clientId, rows);

  if (!Array.isArray(rows) || rows.length === 0 || insertedDefaults) {
    rows = await supabaseRequest(
      `flash_presets?client_id=eq.${encodeFilter(clientId)}&select=id,name,description,theme,base_prompt,negative_prompt,aspect_ratio,resolution,output_format,variants,created_at,updated_at&order=created_at.asc`,
    );
  }

  return Array.isArray(rows) ? rows.map(toPresetItem) : [];
}

export async function upsertPreset(clientId, preset) {
  if (!clientId) {
    throw new Error('clientId manquant');
  }

  const row = normalizePresetInput(preset, {
    fallbackId: sanitizeText(preset?.id),
    clientId,
  });

  const rows = await supabaseRequest('flash_presets?on_conflict=id', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: [row],
  });

  return Array.isArray(rows) && rows[0] ? toPresetItem(rows[0]) : toPresetItem(row);
}

export async function deletePreset(clientId, presetId) {
  if (!clientId || !presetId) {
    throw new Error('clientId ou presetId manquant');
  }

  await supabaseRequest(
    `flash_presets?id=eq.${encodeFilter(presetId)}&client_id=eq.${encodeFilter(clientId)}`,
    {
      method: 'DELETE',
      prefer: 'return=minimal',
    },
  );
}

function normalizeHistoryImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.flatMap((item, index) => {
    if (typeof item === 'string') {
      return [{
        id: `asset_${index}`,
        url: item,
        label: `Image ${index + 1}`,
        variantId: null,
      }];
    }

    if (item && typeof item === 'object' && typeof item.url === 'string') {
      return [{
        id: sanitizeText(item.id, `asset_${index}`),
        url: item.url,
        label: sanitizeText(item.label, `Image ${index + 1}`),
        variantId: sanitizeText(item.variantId, null),
      }];
    }

    return [];
  });
}

export function toHistoryItem(row) {
  return {
    taskId: row.task_id,
    presetId: row.preset_id,
    presetName: row.preset_name || '',
    images: normalizeHistoryImages(row.images),
    date: row.created_at,
  };
}

export async function listHistory(clientId) {
  if (!clientId) {
    throw new Error('clientId manquant');
  }

  const rows = await supabaseRequest(
    `flash_history?client_id=eq.${encodeFilter(clientId)}&select=task_id,preset_id,preset_name,images,created_at&order=created_at.desc`,
  );

  return Array.isArray(rows) ? rows.map(toHistoryItem) : [];
}

export async function saveHistoryEntry({ clientId, entry }) {
  if (!clientId || !entry?.taskId || !entry?.presetId || !Array.isArray(entry?.images)) {
    return null;
  }

  const rows = await supabaseRequest(
    'flash_history?on_conflict=client_id,task_id',
    {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: [{
        client_id: clientId,
        task_id: entry.taskId,
        preset_id: entry.presetId,
        preset_name: sanitizeText(entry.presetName),
        images: normalizeHistoryImages(entry.images),
      }],
    },
  );

  return Array.isArray(rows) && rows[0] ? toHistoryItem(rows[0]) : null;
}

export async function deleteHistory(taskId, clientId) {
  if (!taskId || !clientId) {
    throw new Error('taskId ou clientId manquant');
  }

  await supabaseRequest(
    `flash_history?task_id=eq.${encodeFilter(taskId)}&client_id=eq.${encodeFilter(clientId)}`,
    {
      method: 'DELETE',
      prefer: 'return=minimal',
    },
  );
}
