---
title: Bloom Corp
---

:::{.scrollership scroller-type="deepscatter"}

f

:::chunk

The BLOOM corpus has a lot of elements. This is just a fraction. I'm typing up a couple views as I scroll through to understand a bit better what's in it.

The initial view is colorized by *language*. The biggest areas 
are yellow to the right (French), yellow to the left (Hindi), orange towards the bottom (Chinese), and blue/gray towards the top (Spanish/Portuguese).

```api
max_points: 1e6
zoom_balance: .3
point_size: 6
alpha: 27.25
source_url: "http://localhost:8080/bloomset"
#source_url: "https://files.benschmidt.org/tiles/pubmed/0/0/0.feather"
background_color: "#031109"
encoding:
  filter: {}
  color: 
    field: language
    domain: [-2047, 2047]
    range: set3
```

:::

:::chunk

Filter to a specific language. 

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
      field: language
      lambda: d => true
pattern: 'd => d == "${value}"'
values: ['French',
 'English',
 'Spanish',
 'Chinese',
 'Vietnamese',
 'Portuguese',
 'Hindi',
 'Tamil',
 'Arabic',
 'Indonesian',
 'Bengali, Bangla',
 'Malayalam',
 'Catalan',
 'Marathi (Marāṭhī)',
 'Basque',
 'Telugu',
 'Oriya',
 'Nepali',
 'Kannada',
 'Urdu',
 '(Eastern) Punjabi',
 'Gujarati',
 'Yoruba',
 'Swahili']

```

:::

:::chunk

We can also look at language *families*. This just happens to be in the ISO 639-1 spreadsheet I downloaded; I'm not sure whether it means anything much.

```api
encoding:
  filter: {}
  color: 
    field: family
    domain: [-2047, 2047]
    range: set3
```

:::

:::chunk

A slightly different issue is around *corpora*. If I'm parsing out these file names rightk the end is a string like 

```api
encoding:
  color: 
    field: corpus
    domain: [-2047, 2047]
    range: set3
```

:::


:::chunk

Here is a set of buttons to filter by these corpora: colors show languages, *not* corpus.

```api
encoding:
  color: 
    field: language
    domain: [-2047, 2047]
    range: set3
```

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
      field: corpus
      lambda: d => true
pattern: 'd => d == "${value}"'
values: ['oscar',
 'indic_nlp_corpus',
 'wudaocorpora',
 'binhvq_news_corpus',
 'github-no-gpl',
 's2orc_ai2_pdf_parses_unfiltered',
 'stackexchange',
 'bangla_lm',
 'iitb_english_hindi_corpus',
 'wikipedia',
 'samanantar',
 'arabic_billion_words',
 'wikisource_filtered',
 'unsupervised_cross_lingual_representation_learning_at_scale',
 'bsbasque',
 'brwac',
 'the_pile_uspto',
 'no_code_stackexchange_unfiltered',
 'vinbigdata_monolingual_vlsp_2020',
 'catalan_textual_corpus',
 'leipzig_wortschatz_urdu-pk_web_2019_sentences',
 'wiktionary_filtered',
 'aggregated',
 'opus100',
 'open_subtitles']
 
```

:::


:::

