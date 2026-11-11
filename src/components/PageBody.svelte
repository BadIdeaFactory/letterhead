<script>
  import LetterHeader from './LetterHeader.svelte'
  import PageBodyContent from './PageBodyContent.svelte'

  let { content = '' } = $props()
</script>

<div class="paper" id="page">
  <div class="contents">
    <LetterHeader />
    <div class="body">
      <PageBodyContent {content} />
    </div>
    <footer>
      <div>Bad Idea Factory</div>
      <div>85 Elkins Park Road, Philadelphia, PA 19103</div>
      <div>T 215.224.6421</div>
      <div>spam@biffud.com</div>
    </footer>
  </div>
</div>

<style>
  .paper {
    width: 100%;
    padding-bottom: calc(11 / 8.5 * 100%);
    background-color: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  @media only print {
    .paper {
      box-shadow: none;
    }
  }

  .contents {
    --side-margin: calc(5 / 6 * 72 / 612 * 100%);
    --top-bottom-margin: calc(3 / 6 * 72 / 612 * 100%);
    --ocr-font-size: min(12px, calc(7 / 612 * 100 * 1vw));
    --body-font-size: min(16px, calc(9 / 612 * 100 * 1vw));

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: var(--top-bottom-margin) var(--side-margin);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: var(--body-font-size);
    text-align: left;
    line-height: 1.4;
  }

  .body {
    flex-grow: 1;
    overflow: hidden;
    font-family: var(--letter-font);
    color: black;
  }

  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5%;
    color: #555;
    font-size: var(--ocr-font-size);
  }
</style>
