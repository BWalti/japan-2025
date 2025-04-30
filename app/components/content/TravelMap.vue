<template>
  <ClientOnly>
    <div class="w-auto h-96 m-8">
      <MglMap
          :map-style="style"
          :center="center"
          :zoom="zoom"
      >
        <!-- Tokio -->
        <MglMarker :coordinates="[139.7629567087155, 35.69248892886895]">
          <MglPopup>
            <h1 class="text-black">Tokio</h1>
          </MglPopup>
        </MglMarker>

        <!-- Osaka -->
        <MglMarker :coordinates="[135.50025232490046, 34.68385767409322]">
          <MglPopup>
            <h1 class="text-black">Osaka</h1>
          </MglPopup>
        </MglMarker>

        <!-- Kyoto -->
        <MglMarker :coordinates="[135.75360923673932,34.97188086423928]">
          <MglPopup>
            <h1 class="text-black">Kyoto</h1>
          </MglPopup>
        </MglMarker>

        <!-- Kanazawa -->
        <MglMarker :coordinates="[136.6509227601151, 36.55994478327208]">
          <MglPopup>
            <h1 class="text-black">Kanazawa</h1>
          </MglPopup>
        </MglMarker>

        <!-- Nagano -->
        <MglMarker :coordinates="[138.1347352032429, 36.54642928018616]">
          <MglPopup>
            <h1 class="text-black">Nagano</h1>
          </MglPopup>
        </MglMarker>

        <!-- Fujikawaguchiko -->
        <MglMarker :coordinates="[138.76883704315733, 35.52172881710143]">
          <MglPopup>
            <h1 class="text-black">Fujikawaguchiko</h1>
          </MglPopup>
        </MglMarker>

        <MglFullscreenControl />
        <MglNavigationControl />
        <MglScaleControl />
      </MglMap>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">

import type {LngLatLike} from "maplibre-gl";

const style = 'https://api.maptiler.com/maps/openstreetmap/style.json?key=zz0d4q7iMStM6zMquXrk';
const center: LngLatLike = [139.7629567087155, 35.69248892886895];
const zoom = 6;

</script>