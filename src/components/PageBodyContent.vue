<template>
  <div class="content" v-html="parsedMarkdown"></div>
</template>

<script>
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export default {
  props: {
    content: {
      default: '',
      type: String
    }
  },
  methods: {
    wordArtReplacer: function(match, type, blank, text) {
      return `
          <div class="wordart ${type || "superhero"}">
              <span class="text" data-text="${text}">${text}</span>
          </div>
        `.trim();
    },
  },
  computed: {
    parsedMarkdown: function () {
      marked.setOptions({
        breaks: true,
        headerIds: false,
        smartypants: true,
      })

      // Replaces blocks denoted with %%% with the HTML for WordArt
      const wordArtRule = /%%%(([^%])+\n|)([^%]+)%%%/g;
      const content = this.content.replace(wordArtRule, this.wordArtReplacer);

      // DOMPurify prevents people from typing in custom HTML etc
      // Also prevent some Markdown things that don't belong on the record,
      // like links and images (maybe we support images later some other way)
      const html = DOMPurify.sanitize(marked(content), {
        ALLOWED_TAGS: [
          'b', 'i', 'em', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5',
          'h6', 'br', 'p', 'del', 'ul', 'li', 'blockquote', 'img',
          'span', 'div'
        ]
      })

      // Some logs can have a redacted thing followed by a possessive
      // apostrophe. The "smart quote" created by marked is facing the wrong
      // direction. This looks for a smart quote facing the wrong direction
      // immediately following an HTML tag and "flips" it the other way.
      const fixedHtml = html.replace(/>‘/g, '>’')

      return fixedHtml
    }
  },
}
</script>

<!-- not scoped because the elements we want to style are dynamically generated -->
<style>
@import "../assets/wordart.css";

.content del {
  position: relative;
  background-color: black;
  color: transparent;
  /* Non-standard preservation of background colors for redaction,
    should work in most newer browsers, but not in IE */
  --webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  user-select: none;
}

.content h1 {
  font-size: 1.75em;
}

.content h2, h3, h4, h5, h6 {
  font-size: 1em;
  font-weight: normal;
  margin-top: 2em;
  text-transform: uppercase;
  text-decoration: underline;
}

.content i, .content em {
  font-style: normal;
  text-decoration: underline;
}

.wordart .text {
  display: block;
  font-size: 3em !important;
  line-height: 1.75em;
}
</style>
