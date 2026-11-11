<script>
  import { Marked } from 'marked'
  import { markedSmartypants } from 'marked-smartypants'
  import DOMPurify from 'dompurify'

  const markdown = new Marked()
  markdown.setOptions({ breaks: true })
  markdown.use(markedSmartypants())

  let { content = '' } = $props()

  function wordArtReplacer(match, type, blank, text) {
    return `<div class="wordart ${type || 'superhero'}"><span class="text" data-text="${text}">${text}</span></div>`
  }

  let parsedMarkdown = $derived.by(() => {
    const wordArtRule = /%%%(([^%])+\n|)([^%]+)%%%/g
    const markdownContent = content.replace(wordArtRule, wordArtReplacer)
    const html = DOMPurify.sanitize(markdown.parse(markdownContent), {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5',
        'h6', 'br', 'p', 'del', 'ul', 'li', 'blockquote', 'img',
        'span', 'div'
      ]
    })

    return html.replace(/>‘/g, '>’')
  })
</script>

<div class="content">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html parsedMarkdown}
</div>

<style>
  @import "../assets/wordart.css";

  :global(.content del) {
    position: relative;
    background-color: black;
    color: transparent;
    --webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    user-select: none;
  }

  :global(.content h1) {
    font-size: 1.75em;
  }

  :global(.content h2),
  :global(.content h3),
  :global(.content h4),
  :global(.content h5),
  :global(.content h6) {
    font-size: 1em;
    font-weight: normal;
    margin-top: 2em;
    text-transform: uppercase;
    text-decoration: underline;
  }

  :global(.content i),
  :global(.content em) {
    font-style: normal;
    text-decoration: underline;
  }

  :global(.wordart .text) {
    display: block;
    font-size: 3em !important;
    line-height: 1.75em;
  }
</style>
