<script lang="ts">
  export let data;
  export let settings;
  import {onMount} from 'svelte'
  import Elements from 'pandoc-svelte-components/Elements.svelte'

  const [[id, classes, kv], elems] = data
  const attrs = Object.fromEntries(kv)
  let div = undefined;
  const { src } = attrs;
  $: active = false;
  
  function activate_block() {
    // To run a block means 
    // to execute the code from each of them.
    for (let elem of elems) {
      if (elem.t == "Image") {
        console.log({elem})
      }
    }
  }

  let deactivate = function() {}
  onMount(() => {
    const {observer} = settings;
    if (observer === undefined) {
      throw new Error('observer is undefined');
    }

    div.enter = () => {
      active = true;
      activate_block();
    }
    div.exit = () => {
      active = false;
      deactivate()
    }
    observer.observe(div);
  })
</script>

<div class="bg" class:active={active} style="background-image: url({src})">
</div>
<div class:active={active} bind:this={div} id="{id}" class="chunk scroll-mt-36 {classes.join(" ")}" {...attrs}>
  <bigger>
    <Elements {settings} elems={elems} />
  </bigger>
</div>

<style>
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: 'black';
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.75s;
    pointer-events: none;
  }
  .bg.active {
    opacity: 1;
  }
  .chunk {
    outline: 1px solid grey;
    padding: 10px 30px;
    margin-top: 60vh;
    background-color: #f0f0f0;
    opacity: 0.5;
  }

  

  .chunk.active {
    opacity: 0.999;
  }

</style>

