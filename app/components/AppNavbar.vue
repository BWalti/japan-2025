<script setup lang="ts">
import type {ContentNavigationItem} from "@nuxt/content";

const { data: navigation } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('content')
);

const appConfig = useAppConfig();

onMounted(() => {
  console.log(navigation);
})

// Reactive state to track the active dropdown menu
const activeDropdown = ref<string | null>(null);
const pendingCloseDropdown = ref<string | null>(null);

// Methods to show and hide dropdowns
const showDropdown = (path: string) => {
  activeDropdown.value = path;
};

const setPendingClose = (path: string) => {
  pendingCloseDropdown.value = path;
  nextTick(() => {
    setTimeout(() => {
      if (pendingCloseDropdown.value === path) {
        activeDropdown.value = null; // Close dropdown if pending close hasn't been canceled
      }
    }, 200); // Add a small delay to allow the dropdown to stay open
  });
};

const cancelPendingClose = (path: string) => {
  if (pendingCloseDropdown.value === path) {
    pendingCloseDropdown.value = null; // Cancel the close if hovering over dropdown
  }
};

// Use Vue Router's route composable to get the current path
const route = useRoute();

const isChildActive = (children: ContentNavigationItem[]) => {
  return children.some((child: ContentNavigationItem) => route.path === child.path);
};
</script>

<template>
  <div class="flex justify-between px-4 py-4 mx-auto sm:px-8 max-w-2xl">
    <!-- Navigation -->
    <div class="text-gray-700 dark:text-gray-200">
      <!-- Iterate through navigation items -->
      <div v-for="link in navigation" :key="link.path" class="mr-6 relative inline-block">
        <!-- Check if the item has children (page is false) -->
        <template v-if="link.children">
          <button
              class="hover:underline focus:outline-none"
              :class="{'font-bold': isChildActive(link.children)}"
              @mouseenter="showDropdown(link.path)"
              @mouseleave="setPendingClose(link.path)"
          >
            {{ link.title }}
          </button>
          <!-- Dropdown Menu -->
          <div
              v-if="activeDropdown === link.path"
              class="absolute left-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg"
              @mouseenter="cancelPendingClose(link.path)"
              @mouseleave="setPendingClose(link.path)"
          >
            <NuxtLink
                v-for="child in link.children"
                :key="child.path"
                :to="child.path"
                class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                active-class="font-bold"
            >
              {{ child.title }}
            </NuxtLink>
          </div>
        </template>
        <!-- Render simple link if no children -->
        <NuxtLink v-else :to="link.path" active-class="font-bold" class="hover:underline">
          {{ link.title }}
        </NuxtLink>
      </div>
    </div>
    <!-- Social icons & Color Mode -->
    <div class="text-gray-500 space-x-3 transition">
      <a
        v-if="appConfig.socials?.twitter || appConfig.socials?.x"
        class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
        :href="`https://x.com/${appConfig.socials?.twitter || appConfig.socials?.x}`"
        title="X"
      >
        <Icon class="size-5" name="i-simple-icons-x" />
      </a>
      <a
        v-if="appConfig.socials?.github"
        class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
        :href="`https://github.com/${appConfig.socials?.github}`"
        title="GitHub"
      >
        <Icon class="size-5" name="i-simple-icons-github" />
      </a>
      <a
        v-if="appConfig.socials?.mastodon"
        class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
        :href="`https://elk.zone/${appConfig.socials?.mastodon}`" title="Mastodon"
      >
        <Icon class="size-5" name="i-simple-icons-mastodon" />
      </a>
      <a
        v-if="appConfig.socials?.bluesky"
        class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
        :href="`https://bsky.app/profile/${appConfig.socials?.bluesky}`" title="Bluesky"
      >
        <Icon class="size-5" name="i-simple-icons-bluesky" />
      </a>
      <ColorModeSwitch class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300" />
    </div>
  </div>
</template>
