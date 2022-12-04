---
title: Hathi in bits
---

:::{.scrollership scroller-type="deepscatter"}

:::chunk

Mouseover here and scroll to read!

This is quickly pulled-out version and expanded version of one aside in my slides from the Aeolian conference just showing a point for Ryan Dubcinek and Ted Underwood
that I brought up after Ryan's talk.

```api
source_url: "https://files.benschmidt.org/tiles/hathi_lcc"
duration: 1000
max_points: 1000000
point_size: 2
alpha: 17.25
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

:::chunk

This is an embedding of 7m books in Hathi using my SRP algorithm projected with Nomic Project (UMAP-like algorithm).

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


Colors here are by language.

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

Here's by fine LC class--the fictiony areas are mostly up at the top.

```api

labels:
  url: http://localhost:8080/hathi_lcc/lc1.geojson
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

I joined in the most recent version of the fictionality tests. (tedunderwood/noveltmmeta).
Orange are the books in the 2020 release online: blue are the books *not* in it. 

```api
alpha: 100
point_size: 3
duration: 2000
labels:
  url: http://localhost:8080/hathi_lcc/lcf1.geojson
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
  url: http://localhost:8080/hathi_lcc/lcf1.geojson
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

Here's a lot of popular social science.

```api
zoom:
  bbox: {"x":[57.10818755308427,71.69265614792809],"y":[-9.898820362838393,2.484838781882601]}

```

:::

:::chunk

And of course there are probably a lot of not-caught novels up in the big novel cluster.

My takeaway question is whether something like the map I talked about in my talk 
might be usefully aligned/integrated into some of the workset tools already existing to allow batch-editing
of elements. We've got area selection built into the Atlas viewer at Nomic...
[https://staging-atlas.nomic.ai/map/cf69c2b5-686a-42eb-90f9-fdd24b0ede16/414f4793-a076-4bc6-acb6-9317dae24285](https://staging-atlas.nomic.ai/map/cf69c2b5-686a-42eb-90f9-fdd24b0ede16/414f4793-a076-4bc6-acb6-9317dae24285)
That would make it a lot easier to do something like circle 500 points in a region and assert that they probably aren't fiction. 

It's an interesting tagging/HCI problem that might provide some collaboration opportunities.

:::

:::