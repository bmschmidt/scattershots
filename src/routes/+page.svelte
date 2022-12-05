<script>
  import { base } from '$app/paths';

</script>
<div class="prose m-8">
This a manifest page that I need for Svelte-kit to prerender things.

<ul class="m-4">
<li class="m-4">
<a href="{base}/fiction">Fiction note for Underwood and Dubcinek (2022-12-01)</a>
</li>
<li>
  <a href="{base}/aeolian">Aeolian workshop slides (2022-12-04)</a>
</li>
</ul>
</div>
<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0;
    padding: 0;
  }
  a {
    color: #000;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>