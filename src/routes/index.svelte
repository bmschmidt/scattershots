<script lang="ts">
  // Why does the regular import not work?

  import Scatterplot from '/node_modules/deepscatter/dist/deepscatter.es.js';
  import { onMount } from 'svelte';
  import DoubleSlider from '$lib/components/DoubleSlider.svelte';
  import {timer} from 'd3-timer';

  $: field = "VALID_AIRCRAFT_ROOT"

  const prefs = {
    "source_url" : 'https://bmschmidt.github.io/vietnam_war/',
    "max_points": 30000,
    "alpha" : .25, // Target saturation for the full page.
    "zoom_balance" : 0.22, // Rate at which points increase size. https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
    "point_size": 4, // Default point size before application of size scaling
    "background_color": "#331122",
    "click_function": "select('#ident').html(JSON.stringify(datum, undefined, 2))",
    zoom: {
      bbox: {"x":[99.15172120932304,114.17888963818825],"y":[7.0849741134400706,23.626158008070647]}
    },
    "encoding": {
      jitter_radius : 0.4,
      filter : {},
      filter2: {},
      "color": {
        "field": field,
        "range": "okabe",
        domain: [-2047, 2047]
      },
      "x": {
        field: "x",
        transform: "literal"
      },
      "y": {
        field: "y", 
        transform: "literal"
      }
    }
  };
  
  $: base_prefs = {
    encoding : {
      color: {
        field, 
        range: "pastel1",
        domain: [-2047, 2047]
      },
      filter: {   
      },
      filter2: {    
      }
    }
  }
  $: buttons = []
  $: scatterplot = null
  $: scale = {
      domain : () => [],
      range : () => []
    };
  function redo_scale () {
    scale = scatterplot._renderer.aes.store.color.current.scale
  }

  onMount(() => {
    scatterplot = new Scatterplot("#deepscatter");
    window.plot = scatterplot;
    const first_draw = scatterplot.plotAPI(prefs);
    first_draw.then( () => {
      buttons = ["MILSERVICE", "PERIODOFDAY", "UNIT", "GEOZONE",
        "AIRFORCEGROUP", "TGTTYPE", "MFUNC_DESC", "TGTCOUNTRY", "VALID_AIRCRAFT_ROOT",
        "TAKEOFFLOCATION"]
        redo_scale()
    })
  })
  const update_field = function(f) {
      scatterplot.plotAPI({
        duration: 0.500,
        encoding: {
          'color': {
            'field': f,
            'range': 'okabe',
            'domain': [-2047, 2047]
          }
        }
      }).then(() => {
        scale = scatterplot._renderer.aes.store.color.current.scale    
        field = f    
      })
  }
  function r() {
    const date1 = new Date(1970, 0, this.valueAsNumber - 15)
    const date2 = new Date(1970, 0, this.valueAsNumber + 15)
    scatterplot.plotAPI({
      alpha: 3.5,
      max_points: 10000,
      point_size: 5,
      duration: 0.1,
      encoding: {
        'filter': {
          'field': "MSNDATE",
          op: 'within',
          a: 15,
          b: this.valueAsNumber
        }
      }
    })
  }

  $: filter_class = function(val) {
    scatterplot.plotAPI({
      alpha: 3.5,
      max_points: 10000,
      point_size: 3,
      duration: 0.01,
      encoding: {
        'color': {
          field, 
          range: 'okabe',
          domain: [-2047, 2047]
        },
        'filter2': {
          'field': field,
          lambda: `d => d=="${val}"`
        }
      }
    })
  }
$: my_timer = null
function start_ticking(tick) {
  if (end - start > .75) {
    end = start + .01
  }
  if (my_timer) {
    my_timer.stop()
  }
  my_timer = timer(() => {
    end += tick
    start += tick
    if (end > 1) {
//        end = 1
//        start = 0
      start -= 1
      end -= 1
      //my_timer.stop()
    }
  })
}
function redo_date() {
  scatterplot.plotAPI({
    encoding: {
      filter: {
        field: "MSNDATE",
        op: "within",
        a: (enddate - startdate) / 2,
        b: (enddate + startdate) / 2
      }
    }
  })
}
$: start = 0
$: end = 1
$: startdate = (start - .5) * 1800
$: enddate = (end - .5) * 1800
$: if (scatterplot) {
  enddate;
  startdate;
  redo_date()
}
</script>

<div class="bg-grey-900">
  <div class="fixed">
    <h1 class="text-xl text-grey-200">Vietnam War</h1>
  </div>
  <div class='w-4/5 ml-5 fixed bottom-0 z-50'>
    {#each [["slow", 1/5000], ["medium", 1/2500], ["fast", 1/1000]] as [key, value]}
      <button class='m-2 p-3 bg-gray-200 hover:bg-white transition' on:click={() => start_ticking(value)}>{key}</button>
    {/each}
    <button class='m-2 mx-10 p-3 {my_timer === null ? "bg-gray-800" : "bg-gray-200"} hover:bg-white transition' on:click={() => {if(my_timer) {my_timer.stop(); my_timer = null;}}}>Stop</button>
    <div id="datestring"></div>
    <DoubleSlider bind:start bind:end />
  </div>
  <div id="deepscatter">
    <div>
      <div id="left-overlay" class="overlay left-0 absolute z-50 flex flex-col">
        {#each buttons as b}
          <div class = "rounded m-3 bg-gray-500" on:click={() => update_field(b)}>{b}</div>
        {/each}
      </div>
      <div 
        on:mouseleave={() => scatterplot.plotAPI(base_prefs)}
        id="color-legend" class="overlay right-0 absolute z-50"
        >
        {#each scale.domain().slice(0, 15) as d}
          <div 
            on:mouseover={() => filter_class(d)}
            on:focus={() => filter_class(d)}
            on:click={() => filter_class(d)}
            class="legend-div p-3" style="background-color: {scale(d)}">{d}</div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
      .ttooltip {
        z-index: 99;
        min-width: 500px;
        display : flex;
        flex-direction: row;
        flex-wrap: wrap;

      }
      dl {
        display : flex;
        flex-direction: row;
        flex-wrap: wrap;
      }
      dt {
          font-weight: bold;
          color: rgb(128, 19, 0);
      }

      dt::after {
          content: ":";
      }

      dd {
          margin: 0 0 0 10px;
          padding: 0 0 0.5em 0;
          width: 180px;
      }
      #date {
        width: 100%
      }
</style>