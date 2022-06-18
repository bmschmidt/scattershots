---
title: Billion-point scatterplots
---

:::{.scrollership scroller-type="deepscatter"}

# Billions of points

:::chunk


The European Space Agency has just released version three of the [Gaia mission's](https://sci.esa.int/web/gaia) data about the location of stars in the sky. With many different parameters defined for about 1.8 billion stars, this is the largest dataset with x and y positions for points I know of. And so it's a great opportunity to show off some of the features of the [deepscatter](https://github.com/CreatingData/deepscatter) library I've written for exploring large collections. 

```api
max_points: 1000
point_size: 2
alpha: 7.25
source_url: "http://localhost:8080/gaia"
background_color: "#221133"
zoom:
  bbox: {"x":[-2,2],"y":[-1, 1]}
encoding:
  y:
    field: ix
    range: [-0.2, 0.2]
    domain: [5, 10]
    transform: linear
  color: 
    field: bp_rp
    range: rdbu
    domain: [-5, 5]
```

:::

:::chunk
We'll start off by looking at the 50,000 stars brightest from Earth.  50,000 points is a lot. It's more than enough to count; and it's enough to start to strain many traditional ways of building charts.

The sky is a round dome, so there's not perfect way to render in two-d: what you see here flattens it out using ([the Hammer](https://en.wikipedia.org/wiki/Hammer_projection)) and placing the Milky Way across the equator. 


```api
max_points: 50e3
alpha: 20
point_size: 10
duration: 5000
encoding:
  position: literal
zoom:
  bbox: {"x":[-2,2],"y":[-1, 1]}
```
:::

:::chunk

But 50,000 is not enough to see the structure of something like the Milky Way. 


```api
duration: 5000
point_size: 3
max_points: 100e3
```
:::

::: chunk
What if we want to show more than 50,000 points, though? To scale up to
500,000 points in a chart like this is completely reasonable. So I'm
going to send another several files now to capture every star in the
500,000 thousand brightest in the sky.

A few points, here. One is that pushing this new data to the GPU can be
**slow**. Often when you visit a page with a scatterplot, you'll get a
loading screen for a few seconds. That's fine if you can push all the
data at the start; but with more than a few million points, we need to
push more or less instantaneously or else we'll get blocking lag
everytime we add more data. The easiest cycle-- which I've used
before--is to send things as CSV, parse them into Javascript numbers,
and then draw from those with canvas. Converting those into
single-precision floats before sending to the GPU makes rendering fast
once they're on the GPU: but it does nothing for the period up until
then.

Luckily, a number of very talented people have been thinking hard about
the future of data serialization in an age of GPU computation. I'm
building off of what I find the most attractive of these projects by
using the [Apache Arrow](http://arrow.apache.org/) format to send data
to the browser. Arrow uses a standardized binary representation that
imports directly into typed arrays in Javascript. If you store columns
as 4-byte floats, this means that you can push the data straight to the
GPU without having to parse it even once. Apache Arrow files can be
gzipped before sending; the browser expands them straight into float32
Typed Arrays, which can be written straight to contiguous blocks of
pre-allocated buffers on the GPU. (More on allocation strategies below.)

``` api
max_points: 5e5
alpha: 8.25
point_size: 2
encoding:
  size: 2
  x:
    field: x
    transform: literal
  y:
    field: y
    transform: literal
```
:::

::: chunk
We can really push the envelope, here. Since I don't know if you're
using mobile data, I'll leave it to you to decide if you want to play
with the sliders below that load up to 3 million points into your
screen--about 300MB of data, which compresses down to about 200 that we
actually have to send. (Most datasets include text or categorical data,
and so compress much better than this one does.)

But be warned for the rest of this essay--we're going to load more data
as we go, so you might want to bookmark this if you don't want to
clobber your mobile data limits.

At this point, I'm shipping about 60 MB of data over the wire in a
couple hundred files.

```slider
min: 1000
max: 3000000
api:
  duration: 0.01
target: max_points
trans: log
label: "Number of points"
```

```slider
min: 0
max: 40
api:
  duration: 0.01
target: alpha
trans: linear
label: "Global Opacity"
```

```slider
min: 0
max: 10
api:
  duration: 0.01
target: point_size
trans: sqrt
label: "Point Radius"
```

```api
encoding:
  position: literal
  color: 
    field: bp_rp
    range: rdbu
    domain: [-5, 5]
```
:::

::: chunk

Because we're plotting these as actual data points,
any elements of the aesthetics can be configured on the fly.

Here, for example, I start you off with the points colored
using D3's 'blues' scales according to their magnitude seen from Earth.

But changing the API call means that each of these points can be displayed according to a different scheme:

```button
label: blues
clone: encoding.color
api:
  encoding.color.range: "blues"
```

```button
label: viridis
clone: encoding.color
api:
  encoding.color.range: "viridis"
```

```button
label: magma
clone: encoding.color
api:
  encoding.color.range: "magma"
```
:::

:::chunk
Since deepscatter includes a full grammar of graphics implementation,
we can also change the variables that we show.

```button
label: Apparent brightness
clone: encoding.color
api:
  encoding.color.field: "phot_g_mean_mag"
  encoding.color.domain: [10, 4]
```

```button
label: Absolute brightness
clone: encoding.color
api:
  encoding.color.field: "abs_mag"
  encoding.color.domain: [4, -4]
```

:::


::: chunk
One interesting aspect of this dataset is that it includes parallax
angles for the stars, which measure how much their location shifts when
viewed from different sides of the earth's orbit. Many stars are so far
away that parallax doesn't exist in the latest data release; but among
these front few hundred thousand, we have some sense of the difference
for a great number.

[![Parallax
Example](https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Parallax_Example.svg/256px-Parallax_Example.svg.png){width="256"}](https://commons.wikimedia.org/wiki/File:Parallax_Example.svg "Booyabazooka / CC BY-SA (http://creativecommons.org/licenses/by-sa/3.0/)")

Scaling back to 500K points, I'll change the color encoding to represent
parallax angles.

``` api
max_points: 5e5
encoding:
  alpha: .5
  color:
    field: parallax
    domain: [0, 10]
    range: viridis
```
:::

::: chunk
Parallax is actually motion in the sky; so we can represent this
somewhat more naturally--if more confusingly, because it doesn't match
the visual vocabulary we're used to from the printed page--as a circular
jitter.

Now each star is rotating around its central point with a distance
proportional to how much it actually moves in the sky as the Earth
transits the sun. (I don't actually try to trace the *path* it would
take in the projected space here--that takes a bit more trigonometry
than I'd like to throw here.)

You can dynamically filter the points to high- or low-parallax values
using the slider below.


```slider
label: Filter to parallax
target: encoding.filter.b
min: 0
max: 10
api:
  alpha: 100
  point_size: 10
  encoding:
    filter:
      field: parallax
      op: within
      a: 0.5
      b: 3
```

``` api
jitter: circle
encoding:
  jitter_speed: .01
  color:
    field: parallax
    domain: [0, 10]
    range: viridis
  jitter_radius:
    method: circle
    field: parallax
    domain: [0, 100]
    range: [0, .05]
```
:::

::: chunk
But I promised you a billion points. While Arrow and WebGL allow us to comfortably display tens of millions of points in the browsers, schlepping gigabytes of data directly to your
browser is unreasonable. Deepscatter waits until until you want to zoom into a region to load the individual points on demand using a customized quadtree implementation.

Some parts of the Gaia set are outside the Milky Way proper; here is the Large [Magellanic Cloud](en.wikipedia.org/wiki/Magellanic_Clouds),
where all of the stars are too far off (100,000 light years) to see.

``` api
duration: 10000
jitter: null
encoding:
  jitter_radius: 0
  alpha: .33
  size: .2
  color:
    field: bp_rp
    range: rdbu
    domain: [-5, 5]

zoom:
  bbox:
    {"x":[1.03,1.13],"y":[0.33,0.38]}
```
:::

::: chunk

In some areas, there are huge numbers of stars visible in tiny parts of the sky. In this portion of the Magellanic cloud lurk some stars numbered 1.7 billion or higher in the set.  

``` api
duration: 10000
max_points: 5e5
encoding:
  alpha: 1
  size: 1
  color:
    field: bp_rp
    range: rdbu
    domain: [-5, 5]
zoom:
  bbox: {"x":[1.129,1.1295],"y":[0.368,0.3683]}
```
:::

:::chunk
As we zoom back out, you can see just how tiny this portion of the sky is. 

The portion of the sky we're going to is 3x larger than the moon: the area covered by the Andromeda Galaxy. Since  its individual stars are not visible, you may not be able to see anything in it at first...

```
duration: 20000
max_points: 1e6
zoom:
  bbox: {"x":[-1.5780744616098814,-1.5450523115250894],"y":[0.3505699535775513,0.3721224679810988]}
```

:::

:::chunk
... but deepscatter allows you to change the target number of points displayed. Bumping up the scale to 3,000,000 points, the rings of the Andromeda galaxy become clearly visible.

```api
duration: 2000
max_points: 3e6
```


```slider
min: 1000
max: 3e6
step: 1
target: max_points
trans: log
label: "Number of points"
```

:::
:::chunk

The triangulum galaxy (M33) is relatively nearby to Andromeda, both in the sky and in the local group; its definition is even clearer.

```api
duration: 9000
zoom:
  bbox: 
    {"x":[-1.378083191427632,-1.3514810172803868],"y":[0.5654862401010377,0.582848638975793]}
```

:::

::: chunk

Within our own galaxy are areas of 
intense stellar concentration as well. Here is [Omega Centauri](https://en.wikipedia.org/wiki/Omega_Centauri), 
a globular cluster with 10 million stars in a ball only 150 light-years wide--stars average only 0.1 light years apart.

```api
duration: 12000
max_points: 2e5
zoom:
  bbox: 
    {"x":[0.8319706197989606,0.8394665796325281],"y":[-0.14647132479462066,-0.14157894856028852]}

```

```slider
target: zoom_balance
min: 0
max: 1
label: Zoom transform
```

:::

::: chunk

Let's zoom back out.

``` api
encoding:
  position: literal
zoom:
  bbox: {"x":[-2, 2],"y":[-1, 1]}
```
:::

::: chunk
Now that we've explored various different scales, let me talk about the
tiling strategy here.

To store this much data in a scatterplot, you need to load on demand. I
use a quadtree structure where each tile has up to four children. The
metadata of an Arrow file can contain the names of which children are
actually loaded; when you zoom in to an area, only the points that are
actually needed get loaded.

Click the button below to see the outlines of the currently loaded
tiles. If you've been zooming around, you should see a few big
rectangles covering the full area, and much smaller ones in just the
areas we (or you) have looked at.

```method
label: Show loaded quads
method: visualize_tiles
```

It's necessary to use quadtrees instead of just using ordinary map tiles
because some areas of this chart are much more sparsely populated than
others. At high levels of zoom, this saves the browser from having to
request thousands of csvs with just a few points in it; instead, this
way, we can ensure that all tiles have about 65,000 points. The
underlying Python code to create these quad tiles is part of the repo
for this library.


``` api
encoding:
  position: literal
```
:::

::: chunk

Passing individual data also means 
that Deepscatter is able to 


``` api
max_points: 1e6
point_size: 2
duration: 2500
encoding:
  y:
     field: abs_mag
     domain: [-10, 15]
     range: [-1, 1]
     transform: linear
  x:
     field: bp_rp
     domain: [-5, 5]
     range: [-1, 1]
     transform: linear
  color:
    field: bp_rp
    range: rdbu
    domain: [-5, 5]

```
:::

:::chunk

```slider
label: Filter to parallax
target: encoding.filter.b
min: 0
max: 50
api:
  alpha: 100
  point_size: 10
  encoding:
    filter:
      field: parallax
      op: within
      a: 0.5
      b: 3
```


:::


:::