---
title: Pubmed
---

:::{.scrollership scroller-type="deepscatter"}

# Pubmed

:::chunk

Here's a buncha wikipedia articles.

```api
max_points: 1e6
zoom_balance: .3
point_size: 2
alpha: 27.25
source_url: "http://localhost:8080/pubmed"
#source_url: "https://files.benschmidt.org/tiles/pubmed/0/0/0.feather"
background_color: "#EEEEFF"
encoding:
  color: 
    field: Labels
    domain: [-2047, 2047]
    range: dark2
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


```slider
label: Filter to year
target: encoding.filter.b
min: 1995
max: 2022
api:
  alpha: 100
  point_size: 2
  encoding:
    filter:
      field: Year
      op: within
      a: 1
      b: 2023
```

:::

::: chunk

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

