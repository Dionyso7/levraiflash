# Flash — Presets de génération par niche
*Version 2 — Fidélité produit renforcée*

---

## RÈGLE UNIVERSELLE

Tous les plans 02, 03, 04 partent du plan 01 comme image de référence.
La formule d'ancrage suivante s'applique au début de chaque prompt dérivé :

> "The exact same [product] as in the reference image, with identical shape, identical proportions, identical label design, identical label text, identical colors and materials — do not alter or hallucinate any part of the product."

---

## FLEURISTE

**Logique :** Le bouquet doit rester identique à travers tous les plans. Seul l'environnement et la mise en scène changent.

---

**Plan 01 — Ancre studio**
*Fidèle au réel — générer en premier*

```
The flower bouquet from the reference image, reproduced exactly with identical flowers, identical colors, identical arrangement and identical proportions. Placed upright on a clean white surface, soft diffused natural light from the left, pure white background, bouquet in full sharp focus with visible petal texture, stems clearly visible and bound, no vase, no hands, no text, no props, product photography, 85mm lens equivalent, photorealistic
```

**Negative prompt**
```
hands, fingers, face, person, watermark, text, logo, artificial flowers, plastic, dark background, harsh shadows, different flowers, altered bouquet, vase
```

---

**Plan 02 — Bouquet flottant**
*Money shot*

```
The exact same flower bouquet as in the reference image, with identical flowers, identical colors, identical arrangement and identical proportions — do not alter or hallucinate any part of the bouquet. The bouquet floating mid-air against a pure white background, stems hanging freely below with no surface contact, warm golden rim light from behind sculpting the outline of the stems and petals, soft diffused shadow below suggesting weightlessness, flowers in sharp focus, background completely clean, no hands, no support visible, no text, editorial product photography, photorealistic
```

**Negative prompt**
```
hands, fingers, face, person, watermark, text, different flowers, altered bouquet, vase, surface contact, support structure, dark background
```

---

**Plan 03 — Pétales figés en vol**
*Effet WOW*

```
The exact same flower bouquet as in the reference image, with identical flowers, identical colors, identical arrangement and identical proportions — do not alter or hallucinate any part of the bouquet. The bouquet standing upright surrounded by individual petals suspended mid-air as if just exploded outward from the bouquet, petals matching the exact colors of the flowers in the reference, petals frozen in motion at various distances and angles, pure white background, warm diffused studio light, each petal in sharp focus with visible texture, no hands, no text, high-end floral editorial photography, photorealistic
```

**Negative prompt**
```
hands, fingers, face, person, watermark, text, different flowers, wrong petal colors, altered bouquet, dark background, harsh shadows
```

---

## CAVISTE

**Logique :** La bouteille, l'étiquette, le capsule et la couleur du verre doivent être identiques dans chaque plan. L'IA ne doit jamais inventer une nouvelle étiquette.

---

**Plan 01 — Ancre studio**
*Fidèle au réel — générer en premier*

```
The exact wine bottle from the reference image, reproduced with identical bottle shape, identical glass color, identical capsule color, identical label design, identical label text and typography, identical proportions. Bottle standing upright on a dark slate surface, soft directional studio light from the upper left creating a gentle highlight along the glass, dark charcoal background, full bottle in sharp focus, no additional props, no hands, no glass, no text added, product photography, 85mm lens equivalent, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different bottle, different label, altered label text, invented label, hallucinated text, blurry label, additional bottles, wine glass, props
```

---

**Plan 02 — Lévitation fond sombre**
*Money shot*

```
The exact same wine bottle as in the reference image, with identical bottle shape, identical glass color, identical capsule color, identical label design and identical label text fully preserved and legible — do not alter or hallucinate any part of the bottle or label. The bottle levitating vertically mid-air against a deep black background, two narrow rim lights on each side sculpting the curve of the glass, wine color visible as a rich translucent layer inside the glass, subtle reflection on a glossy surface below, no hands, no support structure visible, luxury editorial product photography, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different bottle, different label, altered label, invented text, blurry label, support structure, white background, props
```

---

**Plan 03 — Accord mets et vins**
*Lifestyle*

```
The exact same wine bottle as in the reference image, with identical bottle shape, identical glass color, identical capsule color, identical label design and identical label text fully preserved and legible — do not alter or hallucinate any part of the bottle or label. The bottle placed upright on a dark slate board surrounded by aged cheese, dark grapes and a folded linen cloth, overhead flat lay composition, soft warm light from above, no hands, no wine glass, luxury food and wine editorial photography, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different bottle, different label, altered label, invented text, blurry label, wine glass, cluttered composition, bright background
```

---

## CHOCOLATIER

**Logique :** La boîte et les chocolats doivent rester identiques. Les plans d'effet (coulée, cassure) sont des éléments neutres sans étiquette — risque d'hallucination faible.

---

**Plan 01 — Ancre studio**
*Fidèle au réel — générer en premier*

```
The exact chocolate box from the reference image, reproduced with identical box shape, identical box design, identical chocolates arrangement, identical chocolate colors and shapes. Box open and photographed from slightly above, soft diffused light from above with no harsh shadows, neutral warm-toned light background, chocolates in sharp focus with visible surface texture and sheen, no hands, no text added, no additional props, clean food product photography, 50mm lens equivalent, photorealistic
```

**Negative prompt**
```
hands, fingers, face, person, watermark, different chocolates, different box, altered design, closed box, dark background, harsh shadows
```

---

**Plan 02 — Coulée chocolat freeze**
*Désir immédiat*

```
A thin stream of liquid dark chocolate whose color exactly matches the chocolates in the reference image, falling and frozen perfectly mid-flow above a glossy dark surface, the stream showing internal texture and warm brown tones, a small frozen splash at the point of impact below, dramatic warm side lighting creating a highlight along the chocolate stream, deep dark background, no hands, no text, macro food photography, photorealistic
```

**Negative prompt**
```
hands, fingers, face, watermark, text, burnt chocolate, dirty surface, wrong chocolate color, cartoon, blurry subject
```

---

**Plan 03 — Cassure suspendue**
*Effet WOW*

```
A single dark chocolate square whose color and finish exactly match the chocolates in the reference image, breaking apart with the two halves frozen mid-separation in the air, fine chocolate crumbs and shards suspended around the break point showing the exact same chocolate texture as the reference, clean matte dark background, warm directional light from the side revealing the rough interior texture, no hands, no text, macro product photography, photorealistic
```

**Negative prompt**
```
hands, fingers, face, watermark, text, wrong chocolate color, burnt chocolate, dirty surface, cartoon, blurry subject
```

---

## ÉPICERIE FINE

**Logique :** Le pot ou produit phare doit conserver son étiquette et sa forme exactes. Même contrainte que le caviste.

---

**Plan 01 — Ancre studio**
*Fidèle au réel — générer en premier*

```
The exact artisan product from the reference image, reproduced with identical jar or packaging shape, identical label design, identical label text and typography, identical product color visible through the packaging. Placed on a light natural wood surface, soft natural window light from the left, clean white or light beige background, product in full sharp focus showing label texture and detail, no hands, no additional props, honest product photography, 85mm lens equivalent, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different product, different label, altered label text, invented label, hallucinated text, plastic packaging, dark background, supermarket products
```

---

**Plan 02 — Coulée dorée freeze backlit**
*Money shot*

```
The exact same product jar as in the reference image, with identical jar shape, identical label design and identical label text fully preserved — do not alter or hallucinate any part of the jar or label. The product pouring or dripping from the jar frozen mid-flow, the liquid matching the exact color of the product in the reference image, warm backlight shining directly through the liquid making it glow and appear translucent, light natural surface below, clean light background, no hands, no text, macro food editorial photography, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different product, different label, altered label, invented text, dark background, artificial colors
```

---

**Plan 03 — Overhead table d'abondance**
*Art de vivre*

```
The exact same product jar as in the reference image, with identical jar shape, identical label design and identical label text fully preserved and legible — do not alter or hallucinate any part of the jar or label. The jar placed at the center of a flat lay overhead composition on a white marble surface, surrounded by complementary artisan items such as aged cheese, bread, dried fruits and nuts and a natural linen napkin, warm diffused natural light from above, generous negative space between items, no hands, no text, lifestyle food editorial photography, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different product, altered label, invented text, plastic packaging, supermarket products, cluttered composition, dark background
```

---

## PARFUMEUR

**Logique :** Le flacon est un objet de luxe à forte identité visuelle. Sa forme, sa couleur de jus et son bouchon doivent être rigoureusement préservés dans chaque plan.

---

**Plan 01 — Ancre studio**
*Fidèle au réel — générer en premier*

```
The exact perfume bottle from the reference image, reproduced with identical bottle shape, identical cap design, identical glass color, identical fragrance liquid color, identical proportions. Standing upright on a clean reflective white surface, soft diffused studio light from slightly above and to the left, white background, bottle in complete sharp focus showing glass clarity and cap detail, subtle clean reflection on the surface below, no hands, no text, no props, luxury product photography, 85mm lens equivalent, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different bottle, different cap, altered shape, invented design, dark background, props, text
```

---

**Plan 02 — Lévitation fond velours**
*Prestige*

```
The exact same perfume bottle as in the reference image, with identical bottle shape, identical cap design, identical glass color and identical fragrance liquid color fully preserved — do not alter or hallucinate any part of the bottle. The bottle floating vertically mid-air against a deep black velvet background, narrow rim lights on both sides creating a thin luminous edge along the glass silhouette, fragrance liquid color glowing from within, perfectly clean surface reflection below, no hands, no support structure visible, no text, ultra sharp, luxury editorial product photography, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different bottle, altered shape, support structure, white background, props, text, different cap
```

---

**Plan 03 — Mist freeze**
*Effet unique*

```
The exact same perfume bottle as in the reference image, with identical bottle shape, identical cap design, identical glass color and identical fragrance liquid color fully preserved — do not alter or hallucinate any part of the bottle. A fine mist of fragrance micro-droplets frozen mid-air around and above the bottle, individual droplets catching a soft backlight and creating a luminous halo, dark background, bottle itself in sharp focus, mist cloud slightly soft and ethereal, no nozzle visible, no hands, no text, luxury fragrance campaign photography, photorealistic
```

**Negative prompt**
```
hands, nozzle, face, person, watermark, different bottle, altered shape, white background, text, different cap, harsh light
```

---

**Plan 04 — Ingrédients botaniques**
*Storytelling*

```
The exact same perfume bottle as in the reference image, with identical bottle shape, identical cap design, identical glass color and identical fragrance liquid color fully preserved — do not alter or hallucinate any part of the bottle. The bottle placed at the center of a composed arrangement of raw botanical ingredients on a dark stone surface, surrounding items include fresh rose petals, dried woody bark, small glass vessel with amber resin and scattered spice seeds, soft warm directional light from above casting gentle shadows, bottle in sharp focus, ingredients slightly softer, no hands, no text, luxury fragrance editorial photography, photorealistic
```

**Negative prompt**
```
hands, face, person, watermark, different bottle, altered shape, white background, text, different cap, cluttered composition
```
