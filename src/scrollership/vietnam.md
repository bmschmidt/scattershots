---
title: Vietnam War
---

:::{.scrollership scroller-type="deepscatter"}

# Pubmed

:::chunk

These are some release notes for the new version of Deepscatter. I thought it would be fun 
to try writing some of them up in a scrolly narration.

The data here are aerial missions by US allied forces during the Vietnam War. This is taken
from the THOR (Theater History of Operations) dataset that was at one point hosted at `data.mil`.
Each point represents a single mission; most are bombings by the allies, but there are a large number 
of 'non-kinetic' (as the DOD calls it) as well. A history of the dataset [is here](https://insight.livestories.com/s/v2/thor-overview/a100cd16-c2a7-453b-8ea6-45947c1bbc51).

```api
max_points: 100000
point_size: 2
source_url: https://bmschmidt.github.io/vietnam_war/
alpha: 10.12
background_color: '#113311'
encoding:
  color:
    domain:
    - -2047
    - 2047
    field: COUNTRYFLYINGMISSION
    range: category10
zoom:
  bbox:
    x:
    - 99.15172120932304
    - 114.17888963818825
    y:
    - 7.0849741134400706
    - 23.626158008070647
zoom_balance: 0.12
```
:::

:::chunk

We have two positions for each of them. Click to shift among them.

```button
label: BERT
api:
  encoding:
    x:
      field: x
      transform: literal
    y:
      field: y
      transform: literal
```

```button
label: TFIDF
api:
  encoding:
    x:
      field: tfidf.x
      transform: literal
    y:
      field: tfidf.y
      transform: literal
```

:::

:::chunk

Colorized by year.

```api
encoding:
  color:
    field: Year
    domain: [1995, 2022]
    range: magma
```

:::

::: chunk
Zoom to some COVID articles

```api
encoding:
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal
zoom:
  bbox: {"x":[-24.93318785023558,23.575650240964745],"y":[-84.29087064820848,-50.3882849104359]}
```
:::

::: chunk
Zoom to some COVID articles
```api
duration: 5500
encoding:
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal
zoom:
  bbox: {"x":[-24.93318785023558,23.575650240964745],"y":[-84.29087064820848,-50.3882849104359]}
```
:::

:::chunk

```api
duration: 5500
encoding:
  x:
    field: tfidf.x
    transform: literal
  y:
    field: tfidf.y
    transform: literal
zoom:
  bbox: {"x":[-6.191034848208633,32.45313346069492],"y":[-191.55286840817564,-164.544651330406]}
```

:::

:::chunk

Change category.

```buttonset
label: Filter
target: "encoding.filter.lambda"
clone: 
  - "encoding.filter"
api:
  duration: 450
  alpha: 100
  encoding:
    filter:
      field: Labels
      lambda: d => true
pattern: 'd => d == "${value}"'
values: ["", "dermatology", "physiology", "genetics", "gynecology", "surgery", "neurology", "unlabeled", "ophthalmology", "material", "radiology", "veterinary", "physics", "biochemistry", "cardiology", "nursing", "engineering", "chemistry", "psychiatry", "neuroscience", "virology", "environment", "cancer", "pediatric", "pathology", "nutrition", "microbiology", "education", "bioinformatics", "ecology", "rehabilitation", "optics", "immunology", "pharmacology", "psychology"]
```

:::

:::

