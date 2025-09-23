<script>
  import Plotly from 'plotly.js-dist-min';
  import { onMount } from 'svelte';

  export let data = [];

  let div;

  onMount(() => {
    Plotly.newPlot(div, [{
      x: data.map(d => d.x),
      y: data.map(d => d.y),
      type: 'scatter',
      mode: 'lines',
      name: 'Shear Force'
    }], { title: 'Shear Force Diagram' });
  });
</script>

<div bind:this={div}></div>
