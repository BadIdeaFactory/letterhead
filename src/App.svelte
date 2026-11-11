<script>
  import { onMount } from 'svelte'
  import { jsPDF } from 'jspdf'
  import PageBody from './components/PageBody.svelte'
  import ContentEditor from './components/ContentEditor.svelte'

  const LETTER_WIDTH_72DPI = 612
  let content = $state('')
  let isEditorActive = $state(false)

  function calculateHTMLScale(el) {
    const srcwidth = el.scrollWidth
    return LETTER_WIDTH_72DPI / srcwidth / window.devicePixelRatio / 1.45
  }

  function handleClear() {
    if (window.confirm('Are you sure you want to clear this document?')) {
      content = ''
    }
  }

  function handleExportPDF() {
    const doc = new jsPDF()
    const el = document.getElementById('page')

    doc.html(el, {
      callback: function (doc) {
        doc.save()
      },
      html2canvas: {
        scale: calculateHTMLScale(el)
      }
    })
  }

  onMount(async () => {
    const response = await fetch('/default.md')
    content = await response.text()
  })
</script>

<main class="container">
  <h1>Bad Idea Factory: Letterhead Template <sup class="beta">beta</sup></h1>
  <div class="controls">
    <button onclick={() => (isEditorActive = true)}>Edit</button>
    <button onclick={handleClear}>Clear</button>
    <button onclick={() => window.print()}>Print</button>
    <button onclick={handleExportPDF}>Export PDF (beta)</button>
  </div>
  <PageBody {content} />
  <footer>
    A <a href="https://biffud.com" target="_blank" rel="noreferer noopener">Bad Idea Factory</a> indulgence.
    <span><a href="https://github.com/badideafactory/letterhead/" target="_blank" rel="noreferer noopener">Source code</a></span>
  </footer>
  {#key content}
    <ContentEditor
      {content}
      isActive={isEditorActive}
      onCancel={() => (isEditorActive = false)}
      onConfirm={(nextContent) => {
        content = nextContent
        isEditorActive = false
      }}
    />
  {/key}
</main>

<style>
  :global(:root) {
    --body-font: 'Overpass', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    --letter-font: 'Overpass', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  }

  :global(html) {
    box-sizing: border-box;
    overflow-x: hidden;
  }

  :global(html *),
  :global(html *::after),
  :global(html *::before) {
    box-sizing: inherit;
  }

  :global(body) {
    background-color: #f2f3f7;
    font-family: 'Overpass', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 20px;
    margin-bottom: 60px;
  }

  @media only screen and (min-width: 768px) {
    :global(body) {
      font-size: 16px;
    }
  }

  main {
    width: 95vw;
    max-width: 1000px;
    margin: 0 auto;
  }

  :global(button) {
    appearance: none;
    border: 1px solid #f0f0f0;
    border-radius: 3px;
    padding: 0.5em 1em;
    margin-right: 1em;
    margin-bottom: 1em;
    background-color: transparent;
    cursor: pointer;
    color: #f0f0f0;
    font-family: var(--body-font);
    font-size: inherit;
  }

  :global(button:last-child) {
    margin-right: 0;
  }

  :global(button:hover) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  :global(body[data-dark-mode="false"]) button {
    color: #333;
    border: 1px solid #333;
  }

  @page {
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
  }

  @media only print {
    .controls {
      display: none;
    }
    main > h1 {
      display: none;
    }
    main {
      width: 100%;
      max-width: 100%;
    }
    main > footer {
      display: none;
    }
  }

  main > footer {
    margin-top: 1.5em;
    margin-left: 1em;
    text-align: right;
    color: #e5e5e5;
  }

  main > footer a,
  main > footer a:visited {
    color: #bbb;
  }

  main > footer a:hover,
  main > footer a:active {
    color: #c9c9c9;
  }

  :global(body[data-dark-mode="false"]) main > footer {
    color: #333;
  }

  :global(body[data-dark-mode="false"]) main > footer a,
  :global(body[data-dark-mode="false"]) main > footer a:visited {
    color: #444;
  }

  :global(body[data-dark-mode="false"]) main > footer a:hover,
  :global(body[data-dark-mode="false"]) main > footer a:active {
    color: #777;
  }

  main > footer span {
    white-space: nowrap;
  }

  .beta {
    text-transform: uppercase;
    font-weight: normal;
    letter-spacing: 0.05em;
    color: #e0e0e0;
    text-decoration: none;
    font-size: 0.5em;
  }

  :global(body[data-dark-mode="false"]) .beta {
    color: #666;
  }

  .controls {
    margin-bottom: 0.5em;
    font-size: 11px;
  }

  @media only screen and (min-width: 768px) {
    .controls {
      font-size: 13px;
    }
  }
</style>
