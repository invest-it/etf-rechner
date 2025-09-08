<script setup>
import Logo from "../assets/footerLogo.svg";
</script>

<template>
  <footer class="bg-base-100 text-base-content border-t border-t-primary pb-5 pt-10" aria-label="Site footer">
    <div class="footer sm:footer-horizontal px-10">
      <aside>
        <a href="/" aria-label="Go to homepage">
          <img :src="Logo" alt="Invest It" class="w-[78px]" />
        </a>
        <address class="not-italic mt-2">
          <strong>Invest it&nbsp;e.V.</strong>
          <br />
          Finanzielle Bildung – unabhängig. kostenlos. fundiert.
          <br />
          Alsterchaussee 26
          <br />
          20149 Hamburg
          <br />
          VR 24456
        </address>
      </aside>
    </div>

    <div class="border-t border-base-300 mt-6 pt-4">
      <p class="mx-auto font-light text-xs text-center">© 2025 Invest it e.V. | Alle Rechte vorbehalten.</p>
    </div>
  </footer>
</template>
