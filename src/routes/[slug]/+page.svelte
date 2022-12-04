<script lang="ts">
  export let data;
  const { document } = data;
  import API from 'deepscatter'; //'/node_modules/deepscatter/dist/deepscatter.js';
  import Scrollership from 'pandoc-svelte-components/custom/ScrollershipWrapper.svelte'
  import Dropdown from '$lib/components/Dropdown.svelte'
  import {page} from '$app/stores'
  // Can return a promise for a constructor to avoid 
  // browser-only problems.
  import CallMethod from '$lib/components/CallMethod.svelte';
  const controls = {
    method: CallMethod,
    dropdown: Dropdown,
  }
  import FullscreenImage from '$lib/components/FullscreenImage.svelte';
  import Slide from '$lib/components/Slide.svelte';
  const settings = {
    elements : {
      "div.fullscreen-image": FullscreenImage,
      "div.slide": Slide
    }
  }
  const {slug} = $page.params;
</script>

<Scrollership {controls} {API} {settings} ast={document} position={slug=="wiki" ? "left" : undefined}>
  <div slot="about">
    
  </div>
  <div slot="credits">

  </div>
</Scrollership>