<script lang="ts">
  export let data;
  export let settings;
  import {onMount} from 'svelte'
  import Elements from 'pandoc-svelte-components/Elements.svelte'

  const [[id, classes, kv], elems] = data
  const attrs = Object.fromEntries(kv)
  let div = undefined;
  let { src } = attrs;
  $: active = false;
  
  function activate_block() {
    // To run a block means 
    // to execute the code from each of them.
    console.log({elems})
    const first = elems[0];
    if (first.t === "Para" && first.c[0].t === "Image") {
      src = first.c[0].c[2][0];     
      if (src.startsWith("images")) {
        src = "https://benschmidt.org/slides/" + src
      }
      if (src.startsWith("/images")) {
        src = "https://benschmidt.org" + src
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

<div class:active={active} class="bg {classes.join(' ')}" style="background-image: url({src})">
  <div class="prose">
    <Elements {settings} elems={src ? elems.slice(1) : elems} />
  </div>
</div>
<div class:active={active} bind:this={div} id="{id}" class="chunk scroll-mt-36 {classes.join(" ")}" {...attrs}>

</div>

<style>
  .bg {
    position: fixed;
    top: 36px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: 'black';
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0.5;
    opacity: 0;
    padding: 36px;
    transition: opacity 0.75s;
    pointer-events: none;
    font-size: 32pt;
    color: white;
    text-shadow: -1px 1px 0 #000, 1px 1px 0 #000,
				 1px -1px 0 #000,
				-1px -1px 0 #000;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
  }
  .bg.small {
    font-size: 16pt;
  }
  .bg.active {
    opacity: 1;
  }
  .chunk {
    outline: 1px solid grey;
    padding: 10px 30px;
    margin-top: 60vh;
    margin-left: -25vw;
    background-color: #f0f0f0;
    opacity: 0.2;
    max-width: 10px;
  }

  

  .chunk.active {
    opacity: 0.999;
  }

</style>

