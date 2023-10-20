<template>
  <div class="paper" id="page">
    <div class="contents">
      <LetterHeader />
      <div class="body">
        <PageBodyContent :content="content"></PageBodyContent>
      </div>
      <footer>
        <div>
          Bad Idea Factory
        </div>
        <div>
          85 Elkins Park Road, Philadelphia, PA 19103
        </div>
        <div>
          T 215.224.6421
        </div>
        <div>
          spam@biffud.com
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import LetterHeader from './LetterHeader'
import PageBodyContent from './PageBodyContent'

export default {
  props: {
    content: {
      default: '',
      type: String
    },
  },
  components: {
    LetterHeader,
    PageBodyContent,
  },
}
</script>

<style scoped>
  .paper {
    width: 100%;
    padding-bottom: calc(11 / 8.5 * 100%);
    background-color: white;
    -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  @media only print {
    .paper {
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }
  }

  .contents {
    /* 
      How margins are calculated:

      The original margins used pica measurements on 8.5x11 (US Letter) paper.
      We divide the original measurements by 6p to get the size in inches, then
      multiply by 72dpi (the default conversion of inches to pixels for screens),
      to get the pixel width. A 8.5" page will display at 612 pixels wide at 72dpi,
      but we also want a responsive layout, so we need to convert the pixels to a
      percentage value. So we divide the pixel width by 612px and multiply by 100%
      to get the percentage value.

      Vertical percentages are based on the element's _horizontal_ measurement so
      we also use the width, not the height, of the element, to calculate vertical
      quantities like the top and bottom margins.
    */
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
