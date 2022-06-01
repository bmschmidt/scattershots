<script lang="ts">
  // Why does the regular import not work?

  const name = 'wiki-1'
  import Scatterplot from '/node_modules/deepscatter/dist/deepscatter.es.js';
  import { onMount } from 'svelte';
  import Tooltip from '$lib/components/Tooltip.svelte';
  import { dev, browser } from '$app/env'
  import DoubleSlider from '$lib/components/DoubleSlider.svelte';
  $: color_field = "bp_rp"
  $: datum = {};
  $: show_tooltip = true;

  $: point_power = 5;
  const prefs = {
    "source_url" : dev ? 'http://localhost:8080/gaia' : "https://static.benschmidt.org/gaia",
    "max_points": 1e5,
    "alpha" : 10.25, // Target saturation for the full page.
    "zoom_balance" : 0.22, // Rate at which points increase size. https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
    "point_size": 4, // Default point size before application of size scaling
    "background_color": "#221133",
    "click_function": "select('#ident').html(JSON.stringify(datum, undefined, 2))",
    "encoding": {
      jitter_radius : 0.4,
      'color': {
        field: "bp_rp",
        range: 'rdbu',
        domain: [-5, 5]
      },
      'x': {
        field: 'x',
        transform: 'literal'
      },
      'y': {
        field: 'y',
        transform: 'literal'
      }
    }
  };
  
  $: position = 'UMAP';
  $: scatterplot = null

  $: {
    if (scatterplot && browser) {
      if (position === 'geo') {
        scatterplot.plotAPI(
          {
            duration: 3,
            encoding: {
                "y": {
                field: "bp_rp",
                transform: "literal",
                domain: [20, -10],
                range: [0, 360]
              },
              "x": {
                field: "abs_mag",
                transform: "literal",
                domain: [30, -30],
                range: [-1, 1]
              }
              }
            }
        )
      } else {
        scatterplot.plotAPI({
          
          encoding: {
          'x': {
          field: 'x',
          transform: 'literal'
        },
        'y': {
          field: 'y',
          transform: 'literal'
        }
      }})
      }
    }
  }

  $: buttons = ['bp_rp', 'parallax', 'phot_g_mean_mag', 'transits', 'abs_mag', 'pm_mag']

  onMount(() => {
    const p = new Scatterplot("#deepscatter");
    window.plot = p;
    const first_draw = p.plotAPI(prefs);
    first_draw.then( () => {
      scatterplot = p
      scatterplot.tooltip_html = d => {
        show_tooltip = true;
        datum = d;
      }
      setInterval(() => {
        if (scatterplot._renderer) {
          n_visible = scatterplot._renderer.n_visible()
        }
      }, 1000)
    })
  })
  const update_color_field = function(f) {
    color_field = f    
  }


$: my_timer = null

$: start = 0
$: end = 1

let show_full_a_files = false;
let filter_field = null;
let filter_val = null;
$: opacity = 23;
$: point_size = 2;
/*$: {
  let filter2 = {
          'field': "directory_year",
          op: 'within',
          a : (end - start) * 40,
          b : (end + start) / 2 * 20 + 1850
        }
  let filter = (filter_val !== null && filter_field !== null) ? {
          'field': filter_field,
          lambda: `d => d=="${filter_val}"`
  } : filter2 */
//  console.log({filter2, filter})
//  filter2 = {};
 const domains = {
  'bp_rp': [5, -3],
  'abs_mag': [-5, 0],
  'pm_mag': [0, 10],
  'phot_g_mean_mag': [5, 20],
  'transits': [0, 30]
 }

 $: {  
  // REACTIVE REPLOT 
  if (scatterplot && browser) {
    console.log("PLOTTING")
    scatterplot.plotAPI({
      duration: .75,
      alpha: opacity,
      max_points: 10 ** point_power,
      point_size, 
      encoding: {
        'color': {
          field: color_field, 
          range: 'rdbu',
          domain: domains[color_field]?? [5, -3]
        },
        'jitter_radius': {
          constant: .1,
          method: 'time'
        }
      }
    })
  }
}

function plotbyx(code) {
  scatterplot.plotAPI({
    encoding: {
      "x": {
        field: code, 
        transform: "linear",
        range: [-100, 100],
        domain: [365.25 * (1840 - 1970), 365.25 * (2000 - 1970)]
      }
    }
  })
}
$: n_visible = 0;

</script>

<div class="bg-grey-900">
  <div class="fixed z-20">
    <h1 class="text-xl text-grey-200">Wikipedia</h1>
  </div>
  <div class='w-4/5 ml-5 fixed bottom-0 w-1/3 z-50 inline bg-gray-200/30 mouseover:bg-gray-200/50 grid grid-cols-1'>
    <div class="flex flex-row items-center">
      <button class:bg-gray-500={position=="geo"} class="w-1/2 hover:bg-gray-200 m-2" on:click={() => position="geo"}>Herzsprung-Russell</button>
      <button class:bg-gray-500={position=="UMAP"} class="w-1/2 hover:bg-gray-200 m-2" on:click={() => position="UMAP"}>Galactic Coords</button>
    </div>
    <details class="inline">
      <summary>Change point size</summary>
      <div class= "grid grid-flow-col grid-rows-2">
      <div>Opacity</div>
      <div>
      <input type="range" min={0.2} max={35.0} step = "0.2" bind:value={opacity}/>
    </div>
    <div>Point size</div>
    <div>
      <input type="range" min={0.5} max={22.0} step = "0.1" bind:value={point_size}/>
    </div>
    <div>Number of points</div>
    <div>
      <input type="range" min={4} max={7} step = "0.1" bind:value={point_power}/>
    </div>
  </div>
    </details>
  </div>
  <div id="deepscatter">
    <div>
      <div id="right-overlay" class="overlay right-3 absolute z-50">
        <details class="inline bg-gray-500 open">
          <summary>Change colors</summary>
          <div class=" grid grid-cols-2">
        {#each buttons as b}
          <div class = "hover:bg-gray-300 rounded m-2 bg-gray-500" on:click={() => update_color_field(b)}>{b}</div>
        {/each}
      </div>
        </details>
      </div>
    </div>
    <div class="fixed hidden bottom-20 z-10 w-3/4 r-5">
      <DoubleSlider bind:start={start} bind:end={end}/>
    </div>  
    <div id="number visible" class="bg-gray-200 right-20 top-10 rounded-full fixed w-1/8 z-10">
      {n_visible} Visible
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