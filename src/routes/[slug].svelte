<script lang="ts">
  export let document;
  import API from '/node_modules/deepscatter/dist/deepscatter.es.js';
  import Scrollership from 'pandoc-svelte-components/custom/ScrollershipWrapper.svelte'
  import slider from '$lib/components/Slider.svelte';
  // Can return a promise for a constructor to avoid 
  // browser-only problems.
  import CallMethod from '$lib/components/CallMethod.svelte';
  const controls = {
    method: CallMethod
  }
</script>

<Scrollership {controls} {API} ast={document}>
  <div slot="about">

  </div>
  <div slot="credits">

  </div>
</Scrollership>