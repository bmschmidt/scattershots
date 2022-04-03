<script lang="ts">
  // Why does the regular import not work?

  import Scatterplot from '/node_modules/deepscatter/dist/deepscatter.es.js';
  import { onMount } from 'svelte';
  import Tooltip from '$lib/components/Tooltip.svelte';

  $: field = "port_of_entry"
  $: datum = {};
  $: show_tooltip = false;

  const prefs = {
    "source_url" : 'http://localhost:8080/tiles',
    "max_points": 11300000,
    "alpha" : 10.25, // Target saturation for the full page.
    "zoom_balance" : 0.22, // Rate at which points increase size. https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
    "point_size": 7, // Default point size before application of size scaling
    "background_color": "#331122",
    "click_function": "select('#ident').html(JSON.stringify(datum, undefined, 2))",
    "encoding": {
      jitter_radius : 0.4,
      filter : {
      },
      filter2: {},
      "color": {
        "field": field,
        "range": "okabe",
        domain: [-2047, 2047]
      },
      "y": {
        field: "ANUMBER",
        transform: "linear",
        domain: [100e6, 0],
        range: [-100, 100] 
        
      },
      "x": {
        field: "DOE", 
        transform: "linear",
        range: [-100, 100],
        domain: [365.25 * (1880 - 1970), 365.25 * 50]
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
      buttons = ["port_of_entry", "naturalization_location", "country", "CERT_NUMBER", "NARA location", "SEX", "field_office", "DFO"]
        redo_scale()
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
      alpha: 13.5,
      max_points: 10000,
      base_point_size: 5,
      duration: 0.1,
      encoding: {
        'filter': {
          'field': "DOB",
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
function redo_date() {
  scatterplot.plotAPI({
    encoding: {
      filter: {
        field: "DOB",
        op: "within",
        a: (enddate - startdate) / 2,
        b: (enddate + startdate) / 2
      }
    }
  })
}
$: start = 0
$: end = 1
$: startdate = (start - .5) * 365.25 * 180
$: enddate = (end - .5) * 365.25 
$: if (scatterplot) {
  enddate;
  startdate;
  redo_date()
}
let show_full_a_files = false;
let filter_field = null;
let filter_val = null;
$: opacity = 3;
$: point_size = 3;
$: {
  if (scatterplot) {
    scatterplot.plotAPI({
      alpha: opacity,
      point_size
    })
  }
}

$: {
  if (scatterplot) {
    if (filter_val !== null && filter_field !== null) {
      console.log({filter_field, filter_val})
      scatterplot.plotAPI(
        {encoding: {
          filter: {
            field: filter_field,
            lambda: 'd => d=="' + filter_val + '"'
          }
        }})
      } else {
        scatterplot.plotAPI({encoding: {filter: {}}})
      }
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
    <h1 class="text-xl text-grey-200">A-files</h1>
  </div>
  <div class='w-4/5 ml-5 fixed bottom-0 w-1/3 z-50 inline bg-gray-200/30 mouseover:bg-gray-200/50 grid grid-cols-1'>
    <details class="inline">
      <summary>Change x axis</summary>
      <button on:click={() => plotbyx("DOB")}>Date of Birth</button>
      <button on:click={() => plotbyx("DOE")}>Date of Entry</button>
    </details>      
    <details class="inline">
      <summary>Change point size</summary>
      <div class= "grid grid-flow-col grid-rows-2">
      <div>Opacity</div>
      <div>
      <input type="range" min={0.2} max={15.0} step = "0.2" bind:value={opacity}/>
    </div>
    <div>Point size</div>
    <div>
      <input type="range" min={0.5} max={22.0} step = "0.1" bind:value={point_size}/>
    </div>
  </div>
    </details>
  </div>
  <div id="deepscatter">
    <div>
      <div id="right-overlay" class="overlay right-3 absolute z-50">
        <details class="inline bg-gray-500">
          <summary>Change colors</summary>
          <div class=" grid grid-cols-2">
        {#each buttons as b}
          <div class = "hover:bg-gray-300 rounded m-2 bg-gray-500" on:click={() => update_field(b)}>{b}</div>
        {/each}
      </div>
        </details>
      </div>
      <div class='tooltip overlay left-3 absolute z-50'>
        <Tooltip datum={datum} visible={show_tooltip} bind:filter_field={filter_field} bind:filter_value={filter_val} />
      </div>
      <div 
        on:mouseleave={() => scatterplot.plotAPI(base_prefs)}
        id="color-legend" class="invisible overlay left-0 absolute z-30"
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