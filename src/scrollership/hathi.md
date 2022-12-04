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
source_url: "http://localhost:8080/hathi_lcc"
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

17,000,000 volumes

:::

:::slide

![](2022-11-30-09-49-26.png)

17 million people

:::


:::slide

![](2022-11-30-09-50-27.png)

17 million people

::::



:::slide

Page-level feature counts: 4TB compressed

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

Book-level feature counts.


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

![](/SRP/toy_SRP_hashing.png)

:::

::: {.slide}
Put formally

D = Document, i = SRP dimension, W = Vocab size, h = binary SHA hash, w = list of vocabulary, c = counts of vocabulary.

![](/SRP/base_SRP_definition.png)

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
![.](images/SRP/hidden_layers.png)

67% accuracy: 87% top-3 accuracy.
:::

Misses are usually not dramatic; 87% of the time the actual result is
within the top 3 predicted by the classifier (that is, under the metric
of top-3 accuracy).


:::slide

![](images/language_accuracy_SRP.png)

:::


:::slide

![Bad Medicine](https://benschmidt.org/slides/images/SRP/bad_medicine.png)

:::


:::slide

# Down to bits

Instead of using floats, **threshold**.

Zero if less than zero: one if greater than zero.


So `[134.123,-12.3, 1.423, -312, -4.2345...]` becomes `10100`.

32x fewer bytes--3.5 GB.

And can be packed as numbers: `10100` is '20'.

[https://observablehq.com/\@bmschmidt/similarity-search-on-millions-of-books-in-browser](https://observablehq.com/@bmschmidt/similarity-search-on-millions-of-books-in-browser)

:::




:::chunk

Here the books are arranged by shelf position

```api
max_points: 3e6
duration: 1000
labelset: "localhost:8080/"
encoding:
  x:
    field: "shelf.x"
    domain: [-2047, 2047]
    range: [-100, 100]
    transform: linear
  y:
    field: "shelf.y"
    domain: [-2047, 2047]
    range: [-100, 100]
    transform: linear
  color: 
    field: "lc0"
    range: pastel1
    domain: [-2047, 2047]
```

:::


:::chunk

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

Two dimensions.

:::

:::{.fullscreen-image src=/2022-11-29-23-05-08.png title=UMAP}
UMAP outline (Sainburg, McInnes, Gentner 2020)
:::


:::chunk

Embedding with Nomic Project (UMAP-like algorithm)

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
  url: http://localhost:8080/hathi_lcc/first language.geojson
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

By LC class

```api

labels:
  url: http://localhost:8080/hathi_lcc/lc0.geojson
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

By LC class

```api

labels:
  url: http://localhost:8080/hathi_lcc/lc1.geojson
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

Years are also represented

```api
labels:
  url: http://localhost:8080/hathi_lcc/lcf1.geojson
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

Coloring by fictionality (tedunderwood/noveltmmeta).

```api
alpha: 100
point_size: 3
labels:
  url: http://localhost:8080/hathi_lcc/lcf1.geojson
  name: lcf1,
  label_field: lc1

encoding:
  color:
    field: fiction
    range: 'pastel1'
    domain: [-2047, 2047]
  filter: {}

    
```

:::


::: chunk

Filtering to only fictional works.

```api
alpha: 1000
point_size: 13
labels:
  url: http://localhost:8080/hathi_lcc/lcf1.geojson
  name: lcf1,
  label_field: lc1
encoding:
  filter:
    field: fiction
    lambda: 'd => d == "fiction"'
    
```

:::

:::