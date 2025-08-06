<script setup>
import Logo from "../assets/footerLogo.svg";
</script>

<template>
  <footer
    class="footer sm:footer-horizontal bg-base-100 text-base-content p-10 border-t-1 border-t-primary"
  >
    <aside>
      <img :src="Logo" alt="Invest It" class="w-[78px]"/>
      <p>
        <strong>
          Invest it&nbsp;e.V.
          <br/>
          Finanzielle Bildung - unabhängig. kostenlos. fundiert.
        </strong>
        <br/>
        Alsterchaussee 26
        <br/>
        20149 Hamburg
        <br/>
        VR 24456
      </p>
    </aside>
  </footer>
  <footer
    class="footer bg-base-100 text-base-content border-base-300 border-t px-10 py-4"
  >
    <p class="mx-auto font-light text-xs">
      2025 Invest it! e.V. | Alle Rechte vorbehalten.
    </p>
  </footer>
</template>
