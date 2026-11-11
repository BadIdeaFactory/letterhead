<script>
  import { onMount } from 'svelte'
  import { Editor, defaultValueCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/kit/core'
  import { commonmark } from '@milkdown/kit/preset/commonmark'
  import { gfm } from '@milkdown/kit/preset/gfm'
  import { history } from '@milkdown/kit/plugin/history'
  import { $nodeSchema as nodeSchema, $remark as remark } from '@milkdown/kit/utils'
  import '@milkdown/kit/prose/view/style/prosemirror.css'

  let { content = '' } = $props()
  let root

  const wordArt = nodeSchema('wordart', () => ({
    group: 'block',
    content: 'text*',
    marks: '',
    attrs: { style: { default: 'superhero' } },
    toDOM: (node) => ['div', { class: `wordart ${node.attrs.style}` },
      ['span', { class: 'text', 'data-text': node.textContent }, 0]],
    parseDOM: [{ tag: 'div.wordart', contentElement: '.text', getAttrs: (element) => ({
      style: Array.from(element.classList).find((name) => name !== 'wordart') || 'superhero'
    }) }],
    parseMarkdown: {
      match: (node) => node.type === 'wordart',
      runner: (state, node, type) => {
        state.openNode(type, { style: node.style })
        state.addText(node.value)
        state.closeNode()
      }
    },
    toMarkdown: {
      match: (node) => node.type.name === 'wordart',
      runner: (state, node) => state.addNode('html', undefined, `%%%${node.attrs.style}\n${node.textContent}\n%%%`)
    }
  }))

  const remarkWordArt = remark('wordart', () => () => (tree) => {
    function transform(node) {
      if (node.type === 'break') node.data = { ...node.data, isInline: false }
      if (!node.children) return
      node.children = node.children.map((child) => {
        if (child.type === 'paragraph') {
          const text = child.children.map((part) => part.type === 'text' ? part.value : part.type === 'break' ? '\n' : '').join('')
          const match = text.match(/^%%%([^%\n]*)\n([^%]+?)\s*%%%$/)
          if (match) return { type: 'wordart', style: match[1] || 'superhero', value: match[2].trim() }
        }
        transform(child)
        return child
      })
    }
    transform(tree)
  })

  onMount(() => {
    let disposed = false
    const editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, content)
        ctx.update(editorViewOptionsCtx, (options) => ({
          ...options,
          attributes: { 'aria-label': 'Letter body', role: 'textbox', 'aria-multiline': 'true' },
          nodeViews: {
            ...options.nodeViews,
            wordart: (node) => {
              const dom = document.createElement('div')
              const text = document.createElement('span')
              text.className = 'text'
              dom.appendChild(text)
              function update(nextNode) {
                if (nextNode.type !== node.type) return false
                dom.className = `wordart ${nextNode.attrs.style}`
                text.dataset.text = nextNode.textContent
                return true
              }
              update(node)
              return { dom, contentDOM: text, update }
            }
          }
        }))
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(wordArt)
      .use(remarkWordArt)

    editor.create().then(() => {
      if (disposed) editor.destroy()
    })

    return () => {
      disposed = true
      if (editor.status === 'Created') editor.destroy()
    }
  })
</script>

<div class="content" bind:this={root}></div>

<style>
  @import "../assets/wordart.css";

  .content {
    height: 100%;
  }

  :global(.content .milkdown),
  :global(.content .ProseMirror) {
    min-height: 100%;
  }

  :global(.content .ProseMirror) {
    outline: none;
  }

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
