<script lang="ts">
  export let datum = {}
  export let visible = true;
  export let filter_field;
  export let filter_value;

  import { FilterIcon, ToggleLeftIcon } from 'svelte-feather-icons'

  const dstring = (date => date ? date.toString().slice(0, 15) : "NA")
  const index_fields = [{
    label: "Born", f: "DOB", filter: false, date: true
    },
    {
      label: "Nationality", f: "country", filter: true
    },
    {
      label: "Date entered", f: "DOE", date: true
    },
    {label: "Entry through", f: "port_of_entry", filter: true},
    {label: "File Cntrl", f: "field_office", filter: true},
    {label: "Date Naturalized", f: "NATZ_DATE", date: true},
    {label: "Place Naturalized", f: "naturalization_location", filter: true},
  ]
  function toggle_filter(f, value) {
    filter_field = filter_field === f ? null : f
    filter_value = filter_value === value ? null : value
    console.log({f, value})
  }
</script>

<div class:hidden={!visible} class="transition p-4 bg-gray-200/50 rounded fixed top-0 left-0 m-3 w-2/5">
  <div class="rounded-t-md bg-orange-200 text-l text-gray-700 font-mono inline text-center p-2">
    A# {datum.ANUMBER}
  </div>
  
  <div  class="rounded-b-md rounded-tr-md bg-orange-200 p-3">
    <div class="text-xl font-bold mb-4">
      {datum.FIRST_NAME} {datum.LAST_NAME}
    </div>
      <dl>
      <div class="grid grid-cols-3 gap-y-4 inline">
        <div class="absolute rounded-xl bg-gray-200/50 p-1 top-1 right-3">
          NARA {datum['NARA location']}
        </div>          
      {#each index_fields as {label, f, filter, date} }
        <dt class="text-gray-700 text-sm font-mono font-bold">{label}</dt>
        <dd class="text-gray-700 text-sm font-mono">
          {#if date}
          {dstring(datum[f])}
          {:else}
          {#if datum[f]}
          <div class="float float-row"></div>
          <div class="inline">{datum[f]}</div>
          <div              
           on:click={() => toggle_filter(f, datum[f])} 
           class="float-right ">
            <FilterIcon 
              class="hover:stroke-2 stroke-1 hover:stroke-gray-700 transition duration-300 stroke-gray-500 {filter_field == f ?  "fill-gray-500" : "fill-transparent"}"
              size=30 />
          </div>
          {:else}
          ???
          {/if}
        {/if}
        </dd>
      {/each}
    </dl>
  </div>
</div>
<style>
  dd {
    @apply col-span-2
  }
</style>