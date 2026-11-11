<script>
  import { onMount } from 'svelte'
  import { CrepeBuilder } from '@milkdown/crepe/builder'
  import { blockEdit } from '@milkdown/crepe/feature/block-edit'
  import { linkTooltip } from '@milkdown/crepe/feature/link-tooltip'
  import { toolbar } from '@milkdown/crepe/feature/toolbar'
  import { editorViewOptionsCtx } from '@milkdown/kit/core'
  import { $nodeSchema as nodeSchema, $remark as remark } from '@milkdown/kit/utils'
  import '@milkdown/kit/prose/view/style/prosemirror.css'
  import '@milkdown/crepe/theme/frame.css'
  import '@milkdown/crepe/theme/common/block-edit.css'
  import '@milkdown/crepe/theme/common/link-tooltip.css'
  import '@milkdown/crepe/theme/common/toolbar.css'

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
    const crepe = new CrepeBuilder({ root, defaultValue: content })
      .addFeature(blockEdit, { advancedGroup: null, listGroup: { taskList: null } })
      .addFeature(linkTooltip)
      .addFeature(toolbar)
    const editor = crepe.editor
      .config((ctx) => {
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
      .use(wordArt)
      .use(remarkWordArt)

    crepe.create().then(() => {
      if (disposed) crepe.destroy()
    })

    return () => {
      disposed = true
      if (editor.status === 'Created') crepe.destroy()
    }
  })
</script>

<div class="content" bind:this={root}></div>

<style>
  @import "../assets/wordart.css";

  .content {
    height: 100%;
  }

  :global(.content .milkdown) {
    height: 100%;
    position: relative;
    --crepe-font-default: var(--body-font);
  }

  :global(.content .ProseMirror) {
    height: 100%;
    overflow: hidden;
  }

  :global(.content .ProseMirror) {
    outline: none;
  }

  :global(.content .ProseMirror del) {
    position: relative;
    background-color: black;
    color: transparent;
    --webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    user-select: none;
  }

  :global(.content .ProseMirror h1) {
    font-size: 1.75em;
  }

  :global(.content .ProseMirror h2),
  :global(.content .ProseMirror h3),
  :global(.content .ProseMirror h4),
  :global(.content .ProseMirror h5),
  :global(.content .ProseMirror h6) {
    font-size: 1em;
    font-weight: normal;
    margin-top: 2em;
    text-transform: uppercase;
    text-decoration: underline;
  }

  :global(.content .ProseMirror i),
  :global(.content .ProseMirror em) {
    font-style: normal;
    text-decoration: underline;
  }

  :global(.wordart .text) {
    display: block;
    font-size: 3em !important;
    line-height: 1.75em;
  }

  :global(.milkdown-toolbar button),
  :global(.milkdown-block-handle button) {
    border: 0;
    margin: 0;
    background: transparent;
  }

  :global(.milkdown-slash-menu ul),
  :global(.milkdown-slash-menu h6) {
    margin: 0;
    padding: 0;
  }

  :global(.milkdown-slash-menu) {
    max-width: min(320px, 90vw);
  }

  :global(.milkdown .milkdown-slash-menu .menu-groups) {
    max-height: min(420px, calc(50vh - 60px));
  }

  @media print {
    :global(.milkdown-toolbar),
    :global(.milkdown-block-handle),
    :global(.milkdown-slash-menu),
    :global(.milkdown-link-preview),
    :global(.milkdown-link-edit) {
      display: none !important;
    }
  }
</style>
