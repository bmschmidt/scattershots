---
title: Hathi in bits
---

:::{.scrollership scroller-type="deepscatter"}

# How small can big data get?

:::slide

# How Small can Big Data Get?

Ben Schmidt, Nomic

benschmidt.org

nomic.ai

:::

:::chunk

```api
max_points: 100000
point_size: 2
alpha: 17.25
source_url: "https://files.benschmidt.org/tiles/hathi_lcc"
background_color: "#221133"
tooltip_html: |
  return `
  <div>
  ${datum.author}, <em>${datum.title}</em>. (${datum.year})
  <br>
  <smaller style="font-family:monospace">${datum['first language']} -- ${datum.lcc}<smaller>
  </div>
  <div style="font-size: 12pt">${datum.lc1}</div>

  `
click_function: |
  window.open(`https://babel.hathitrust.org/cgi/pt?id=${datum.htid.replace(":","+").replace("/", "=")}`, "_blank")  
encoding:
  position: literal
  jitter_radius:
    constant: .001
    method: normal
  color: 
    field: "first language"
    range: pastel1
    domain: [-2047, 2047]
```

:::

:::slide

## Why make big data small?

1. To follow copyright law.
2. To enable different kinds of uses.
3. To increase usage of the source materials.
4. To drive understanding of the types of materials. (Eg, FAccT).

:::


:::slide

## Three specific goals

1. Small enough to work with on a laptop (~100GB)
2. Small enough to load into memory (~10GB)
3. Small enough to build into a web application. (~500MB-1GB)

:::


:::slide

## Dataset

The Hathi Digital Library is 17 million volume scans, many originally
from the Google Books project.

:::

:::slide

Hathi distributes page-level feature counts: 4TB compressed

```json

{
  "pages": [{
    "Ishmael": 1,
    "call": 1,
    "me": 2,
  },"..."]
}
```

:::

:::slide

These are easily transformed to book-level feature counts.

```json

{
    "Ishmael": 30,
    "call": 101,
    "me": 4332,
    [50,000 more words]
}

```

:::

:::slide

Hard-drive sized representations (64GB) will be a *vector* for each work.

[
  2.41324,
  6.56126,
  15.354,
  -24.4256,
  [...100 to 1000 more numbers]
]

:::


:::

How do you get an embedding?

Usually, a *neural network.*

Technical problem... We still don't have neural networks that embed book-length texts!

:::

::: {.slide}

Social problem: 

Embeddings *promote* access by opening new interfaces and forms of discoverability.

But embeddings *deny* access to classes of artifacts and communities that don't resemble their training set.
:::

::: {.slide}
How do we reduce dimensionality?

1. Principal Components Analysis on the Term-Document matrix.
2. Top-n words.
3. Topic models.
:::

Don't use the best method.

::: {.slide}
## Reasons not to use the best methods.

> 1. Computationally intractable: full matrix is trillions of rows, sparse matrix is billions.
> 2. Difficult to distribute; users at home can't embed documents in your space.
> 3. Any embedded space is optimal only for the text collection it was trained on.
:::

------------------------------------------------------------------------

::: {.slide}
### A Minimal, Universal Dimensionality Reduction for text should:

> 1. Be domain-agnostic.
> 2. Be language-agnostic.
> 3. Be capable of accounting for any vocabulary.
> 4. Make only general assumptions about human language.
> 5. Be capable of working from existing feature-count datasets.
> 6. Be easily implementable across platforms and languages.
:::


::: {.slide}
Example: projection

![](SRP/toy_dot_product.png)
:::

::: {.slide}
Take SHA-1 hashes for all words.(Because SHA-1 is available everywhere).

bank -> `bdd240c8fe7174e6ac1cfdd5282de76eb7ad6815`

```
1011110111010010010000001100100011111110011100010111010011100110101
0110000011100111111011101010100101000001011011110011101101110101101
1110101101011010000001010111101101010000011110100111110111000101001
01101111100111110000100111101100010101101101101110101101101010
```
:::


::: {.slide}
Cast the binary hash to `[1, -1]`,  (Achlioptas) generating a reproducible quasi-random projection 
matrix that will retain document-wise distances in the reduced space.

![](SRP/toy_SRP_hashing.png)

:::

::: {.slide}
Put formally

D = Document, i = SRP dimension, W = Vocab size, h = binary SHA hash, w = list of vocabulary, c = counts of vocabulary.

![](SRP/base_SRP_definition.png)

:::

::: {.slide}
Put informally.

* Each dimension is the sum of the wordcounts for a random half the words, minus the sum of the wordcounts for the other half.
* Words that have the similar vocabulary will be closer on all the dimensions.
:::

::: {.slide}
Library of Congress Classification

* Shelf locations of books.
* Widely used by research libraries in United States.
* ~220 "subclasses" at first level of resolution.
:::

::: {.slide .small}


|Instances |Class name (randomly sampled from full population)                                                                                                              |
|---------:|:-----------------------------------------------------------------------------------------------------------------------|
|       461|AI [Periodical] Indexes                                                                                                              |
|      6986|BD Speculative philosophy                                                                                               |
|      9311|BJ Ethics                                                                                                               |
|     40335|DC [History of] France - Andorra - Monaco                                                                                            |
|      2738|DJ [History of the] Netherlands (Holland)                                                                                                |
|     14928|G GEOGRAPHY. ANTHROPOLOGY. RECREATION [General class]                                                                               |
|     17353|HN Social history and conditions. Social problems. Social reform                                                        |
|      4703|JV Colonies and colonization. Emigration and immigration. International migration                                       |
|        23|KB Religious law in general. Comparative religious law. Jurisprudence                                                   |
|      5583|LD [Education:] Individual institutions - United States                                                                              |
|      3496|NX Arts in general                                                                                                      |
|      6222|PF West Germanic languages                                                                                              |
|     68144|PG Slavic languages and literatures. Baltic languages. Albanian language                                                |
|    157246|PQ French literature - Italian literature - Spanish literature - Portuguese literature                                  |
|      6863|RJ Pediatrics                                                                                                           |

:::

### Success rate

::: {.slide}
![.](https://benschmidt.org/slides/images/SRP/hidden_layers.png)

67% accuracy: 87% top-3 accuracy.
:::

Misses are usually not dramatic; 87% of the time the actual result is
within the top 3 predicted by the classifier (that is, under the metric
of top-3 accuracy).


:::slide

![](https://benschmidt.org/slides/images/language_accuracy_SRP.png)

:::


:::slide

![Bad Medicine](https://benschmidt.org/slides/images/SRP/bad_medicine.png)

:::


:::slide

# Bit-level Hathi features

Instead of using floats, **threshold**.

Zero if less than zero: one if greater than zero.


So `[134.123,-12.3, 1.423, -312, -4.2345...]` becomes `10100`.

32x fewer bytes--3.5 GB.

And can be packed as numbers: `10100` is '20'.

[https://observablehq.com/\@bmschmidt/similarity-search-on-millions-of-books-in-browser](https://observablehq.com/@bmschmidt/similarity-search-on-millions-of-books-in-browser)

:::

:::chunk

Here the books are arranged by shelf position.

```api
max_points: 3e6
duration: 1000
labelset: "localhost:8080/"
encoding:
  x:
    field: "shelf.x"
    domain: [-2047, 2047]
    range: [-80, 80]
    transform: linear
  y:
    field: "shelf.y"
    domain: [-2047, 2047]
    range: [-80, 80]
    transform: linear
  color: 
    field: "lc0"
    range: pastel1
    domain: [-2047, 2047]
```

```buttonset
label: Color
values: ["A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "Z"]
api:
  duration: 500
  encoding:
    filter:
      field: lc0
      lambda:  "d => d != 'FFF'"
      range: "pastel1"
clone:
  - "encoding.filter"
pattern: "d => d == '${value}'"
target: "encoding.filter.lambda"
```


```button
label: Clear
api:
  encoding:
    filter:
      field: lc0
      lambda:  "d => d != 'FFF'"
      range: "pastel1"
```
:::


:::chunk

Click to change the language.

```buttonset
label: Color
values: ["lc1", "lc0", "first language" ]
duration: 500
api:
  encoding:
    color:
      field: "${value}"
      domain: [-2047, 2047]
      range: "pastel1"
clone:
  - "encoding.color"
target: "encoding.color.field"
```

:::

:::slide

Moving down to two dimensions gives you data that you can send straight to a browser.

But how to get two-d data that's usable?

:::

:::slide

![UMAP outline](2022-11-29-23-05-08.png)

UMAP outline (Sainburg, McInnes, Gentner 2020)

:::


:::chunk

Embedding with Nomic Project (UMAP-like algorithm built into our pipeline).

```api
duration: 10000
encoding:
  color: 
    field: lc0
    range: set3
    domain: [-2047, 2047]
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal

```


```buttonset
label: Color
values: ["lc1", "lc0", "first language" ]
api:
  duration: 500
  encoding:
    color:
      field: "${value}"
      domain: [-2047, 2047]
      range: "dark2"
clone:
  - "encoding.color"
target: "encoding.color.field"
```


:::




::: chunk

By language

```api

labels:
  url: https://files.benschmidt.org/tiles/hathi_lcc/first language.geojson
  name: first language,
  label_field: first language

duration: 1000
encoding:
  color: 
    field: first language
    range: dark2
    domain: [-2047, 2047]
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal

```

:::


::: chunk

By first letter of the LC class. (Big letters like 'H' for social science, 'Q' for science, 'P' for literature.)

```api

labels:
  url: https://files.benschmidt.org/tiles/hathi_lcc/lc0.geojson
  name: lc0,
  label_field: lc0

duration: 1000
encoding:
  color: 
    field: lc0
    range: dark2
    domain: [-2047, 2047]
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal

```

:::

::: chunk

By full LC class. (BF for psychology, PR for American literature, QA for mathematics, etc.)

```api

labels:
  url: https://files.benschmidt.org/tiles/hathi_lcc/lc1.geojson
  name: lc1,
  label_field: lc1

duration: 1000
encoding:
  color: 
    field: lc1
    range: dark2
    domain: [-2047, 2047]
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal

```

:::

::: chunk

Years are also represented in the encoding.

```api
labels:
  url: https://localhost:8080/hathi_lcc/lcf1.geojson
  name: lcf1,
  label_field: lc1
zoom:
  bbox: 
    "x":[6.820670969767077,50.80093820611572],
    "y":[-74.09120788507597,-36.747602596554735]
```

```slider
label: Filter to year
target: encoding.filter.b
min: 1800
max: 2020
api:
  alpha: 100
  point_size: 6
  encoding:
    filter:
      field: year
      op: within
      a: 5
      b: 1980
```

:::


::: chunk

## Case study.

I joined in the most recent version of the widely used Underwood et al fiction dataset from (tedunderwood/noveltmmeta).

Here's the corpus by fine LC class--the fictiony areas are mostly up at the top.

```api

labels:
  url: https://localhost:8080/hathi_lcc/lc1.geojson
  name: lc1,
  label_field: lc1
zoom:
  bbox: {"x":[17.48389020116793,59.0917583251507],"y":[-72.46750252090222,-37.138299181394295]}
duration: 10000
encoding:
  color: 
    field: lc1
    range: dark2
    domain: [-2047, 2047]
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal

```

:::

::: chunk

Orange are the books in the 2020 release online: blue are the books *not* in it. 

```api
alpha: 100
point_size: 3
duration: 2000
labels:
  url: https://localhost:8080/hathi_lcc/lcf1.geojson
  name: lcf1,
  label_field: lc1

encoding:
  color:
    field: fiction
    range: 'category10'
    domain: [-2047, 2047]
  filter: {}

    
```

:::

::: chunk

At the global level, we can validate the classification and the embedding space--there's a great overlap here.

```api
zoom: 
  bbox: {"x":[-112.9849056648865,144.91068235828854],"y":[-109.44725686985227,109.5316545822581]}
```

:::

::: chunk

But filtering to only fictional works, there are also areas where there's a pretty significant misallocation.

```api
alpha: 1000
point_size: 13
labels:
  url: https://localhost:8080/hathi_lcc/lcf1.geojson
  name: lcf1,
  label_field: lc1
encoding:
  filter:
    field: fiction
    lambda: 'd => d == "fiction"'
    
```

:::

:::chunk

You can click  'Hide narrative' in the upper left to mouseover books and read titles here, or click through to Hathi.

Here a bunch of French language novels that metadata erroneously reports as English. (I believe that's the case?)

```api
zoom: 
  bbox: {"x":[-33.6340072693047,-8.657460869913105],"y":[64.6277245697059,85.8352876160362]}
```

:::


:::chunk

The area of mis-categorization I find most interesting are non-technical books about dressmaking, etc.--
I think this might be a specifically linear regression problem, where clothing is a vocabulary highly used in novels and not highly used in other books.

```api
zoom: 
  bbox: {"x":[40.5185483180567,55.72384539778603],"y":[28.13362232481508,41.04442637674741]}
```

:::

:::chunk

Over here are a smaller number of books about sales and negotiating with similar problems. (Note that I'm only using about 1/3 of Hathi in this visualization, so
there are probably quite a few more in each of these clusters in the released version.)

```api
zoom:
  bbox: {"x":[46.51550349426714,61.59337539945985],"y":[11.757088794433685,24.559696245464433]}
```

:::

:::chunk

Here's a lot of popular social science classed as fiction.

```api
zoom:
  bbox: {"x":[57.10818755308427,71.69265614792809],"y":[-9.898820362838393,2.484838781882601]}

```

:::

:::chunk

And of course there are probably a lot of not-caught novels up in the big novel cluster.

Data visualization tools like this can be useful in addition to traditional methods for tagging, 
or on their own as a way to identify and isolate groups of information.

:::

:::

[https://staging-atlas.nomic.ai/map/cf69c2b5-686a-42eb-90f9-fdd24b0ede16/414f4793-a076-4bc6-acb6-9317dae24285]

:::

:::