---
title: Chicago
---

:::{.scrollership scroller-type="deepscatter"}

# Pubmed

:::chunk

Here's the Chicago corpus.

```api
max_points: 1e6
zoom_balance: .3
point_size: 6
alpha: 27.25
source_url: "http://localhost:8080/chicago"
#source_url: "https://files.benschmidt.org/tiles/chicago/0/0/0.feather"
background_color: "#EEEEEE"
encoding:
  color: 
    field: canon
    domain: [-2047, 2047]
    range: dark2
```

:::


:::chunk

Differing UMAP settings tweak the embeddings.

```buttonset
label: UMAP Neighbors
target: "encoding.position"
values: ['three', 'seven', 'sixteen', 'thirtyseven', 'fifty']
```

:::

:::chunk

Colorized by publisher.

```api
encoding:
  color: 
    field: publisher
    domain: [-2047, 2047]
    range: dark2
```

```buttonset
target: "encoding.color.field"
values: ["publisher", "canon", "year"]
api:
  encoding:
    field: "color"
    domain: [-2047, 2047]
    range: dark2
```

:::

:::chunk

Here is a set of buttons that filter based on the author.

```buttonset
label: Author
target: "encoding.filter.lambda"
clone: 
  - "encoding.filter"

pattern: 'd => d == "${value}"'
values: ["Mertz, Barbara", "Stout, Rex", "Christie, Agatha",
         "Hill, Grace Livingston", "Burroughs, Edgar Rice", "Anthony, Piers", "MacDonald, John D.", 
         "Heyer, Georgette", "McCaffrey, Anne", "Rinehart, Mary Roberts", "L'Amour, Louis", "Kaminsky, Stuart M", "Roberts, Nora", "McBain, Ed", "Pronzini, Bill", "Faust, Frederick Schiller", 
         "Gardner, Erle Stanley", "Dick, Philip K", "Block, Lawrence", "Oppenheim, E. Phillips", "Dickson, Gordon R", "Leonard, Elmore", "Queen, Ellery", "Heinlein, Robert A.", "James, Henry", "Lackey, Mercedes", "Stewart, Alfred Walter", "Crider, Bill", "Weis, Margaret", "Hambly, Barbara", 
         "Braun, Lilian Jackson", "Cheyney, Peter", "Wallace, Edgar", "Millar, Kenneth", "Fast, Howard", 
         "Buck, Pearl S.", "Crawford, F. Marion", "Herbert, Frank", "Muller, Marcia", "Silverberg, Robert"]
api:
  duration: 400
  point_size: 20
  alpha: 100
  encoding:
    filter:
      field: author
      lambda: "d => true"
```

:::

:::