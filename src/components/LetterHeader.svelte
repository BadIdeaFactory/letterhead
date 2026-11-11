<script>
  import logo from '../assets/bif_logo.svg'
</script>

<header>
  <img src={logo} alt="" draggable="false" />
</header>

<style>
  header {
    margin-bottom: 20%;
    margin-top: 5%;
  }

  header img {
    position: absolute;
    top: 8%;
    right: var(--side-margin);
    width: calc(9.75 / 6 * 72 / 612 * 100%);
    height: auto;
    user-select: none;
    pointer-events: none;
  }
</style>
