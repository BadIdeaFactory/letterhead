<template>
  <main class="container">
    <h1>Bad Idea Factory: Letterhead Template <sup class="beta">beta</sup></h1>
    <div class="controls">
      <button @click="handleEdit">Edit</button>
      <button @click="handleClear">Clear</button>
      <button @click="handlePrint">Print</button>
      <!-- button @click="handleExportPDF">Export PDF (beta)</button -->
    </div>
    <Page :content="content"></Page>
    <footer>
      A <a href="https://biffud.com" target="_blank" rel="noreferer noopener">Bad Idea Factory</a> indulgence.
      <span><a href="https://github.com/badideafactory/letterhead/" target="_blank" rel="noreferer noopener">Source code</a></span>
    </footer>
    <Editor
      :key="content"
      :isActive="isEditorActive"
      v-on:update:isEditorActive="isEditorActive = $event"
      :content="content"
      v-on:update:content="content = $event"
    ></Editor>
  </main>
</template>

<script>
import { jsPDF } from 'jspdf'
import Page from './components/Page'
import Editor from './components/Editor'

const LETTER_WIDTH_72DPI = 612 // pixels

function calculateHTMLScale (el) {
  const srcwidth = el.scrollWidth
  return LETTER_WIDTH_72DPI / srcwidth / window.devicePixelRatio / 1.45
}

export default {
  name: 'App',
  components: {
    Page,
    Editor,
  },
  data() {
    return {
      content: '',
      isEditorActive: false,
    }
  },
  methods: {
    handleEdit: function () {
      // opens an editor which reads from this.content, and sets this value
      this.isEditorActive = true
    },
    handleClear: function () {
      if (window.confirm('Are you sure you want to clear this document?')) {
        this.content = ''
      }
    },
    handlePrint: function () {
      window.print()
    },
    handleExportPDF: function () {
      const doc = new jsPDF()
      const el = document.getElementById('page')

      doc.html(el, {
        callback: function (doc) {
          doc.save()
        },
        html2canvas: {
          scale: calculateHTMLScale(el)
        },
      })
    },
  },
  mounted() {
    window.fetch(`/default.md`)
      .then((response) => response.text())
      .then((content) => {
        this.content = content
      })
  }
}
</script>

<style>
:root {
  --body-font: 'Overpass', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  --letter-font: 'Overpass', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}

html {
  box-sizing: border-box;
  overflow-x: hidden;
}

html *,
html *::after,
html *::before {
  box-sizing: inherit;
}

body {
  background-color: #f2f3f7;
  font-family: 'Overpass', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 20px;
  margin-bottom: 60px;
}

@media only screen and (min-width: 768px) {
  body {
    font-size: 16px;
  }
}

main {
  width: 95vw;
  max-width: 1000px;
  margin: 0 auto;
}

button {
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

button:last-child {
  margin-right: 0;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

body[data-dark-mode="false"] button {
  color: #333;
  border: 1px solid #333;
}

/* usually auto-hides page footer/header on print */
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
  footer {
    display: none;
  }
}

</style>

<style scoped>
footer {
  margin-top: 1.5em;
  margin-left: 1em;
  text-align: right;
  color: #e5e5e5;
}

footer a,
footer a:visited {
  color: #bbb;
}

footer a:hover,
footer a:active {
  color: #c9c9c9;
}

body[data-dark-mode="false"] footer {
  color: #333;
}

body[data-dark-mode="false"] footer a,
body[data-dark-mode="false"] footer a:visited {
  color: #444;
}

body[data-dark-mode="false"] footer a:hover,
body[data-dark-mode="false"] footer a:active {
  color: #777;
}

footer span {
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

body[data-dark-mode="false"] .beta {
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
