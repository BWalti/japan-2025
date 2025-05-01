<script setup lang="ts">
import {Menu, MenuButton, MenuItems, MenuItem, Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {ref} from 'vue'
import type {ContentNavigationItem} from "@nuxt/content";
import TimeInTokyo from "~/components/TimeInTokyo.vue";

const {data: navigation} = await useAsyncData('navigation', () =>
    queryCollectionNavigation('content')
        .where('published', '=', true)
);

function extractChildren(n: ContentNavigationItem) {
  return n.children!.map((child: ContentNavigationItem) => child.path);
}

function getNavigatablePaths() {
  return navigation.value?.flatMap(n => n.children ? extractChildren(n) : n.path) ?? [];
}

prerenderRoutes(getNavigatablePaths());

const appConfig = useAppConfig();
const route = useRoute();

// Track mobile menu open/close
const mobileMenuOpen = ref(false);

const isChildActive = (children: ContentNavigationItem[]) => {
  return children.some((child: ContentNavigationItem) => route.path === child.path);
};

// Close mobile menu manually
function closeMobileMenu() {
  mobileMenuOpen.value = false;
}
</script>

<template>
  <div class="px-4 py-4 mx-auto sm:px-8 max-w-7xl flex justify-between items-center">
    <!-- Logo or WeatherWidget -->
    <WeatherWidget/>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex text-gray-700 dark:text-gray-200 space-x-6">
      <div v-for="link in navigation" :key="link.path" class="relative">
        <template v-if="link.children">
          <Menu as="div" class="relative inline-block text-left">
            <MenuButton
                class="hover:underline focus:outline-none cursor-pointer"
                :class="{ 'font-bold': isChildActive(link.children) }"
            >
              {{ link.title }}
            </MenuButton>

            <Transition
                enter="transition ease-out duration-100"
                enter-from="transform opacity-0 scale-95"
                enter-to="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leave-from="transform opacity-100 scale-100"
                leave-to="transform opacity-0 scale-95"
            >
              <MenuItems
                  class="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg focus:outline-none z-20"
              >
                <div class="py-2">
                  <MenuItem
                      v-for="child in link.children"
                      v-slot="{ active }"
                      :key="child.path"
                      class="px-4 text-l"
                  >
                    <NuxtLink
                        :to="child.path"
                        :class="[
                        'block px-4 py-2 text-sm',
                        active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                      ]"
                        active-class="font-bold"
                    >
                      {{ child.title }}
                    </NuxtLink>
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </template>

        <!-- Simple link -->
        <template v-else>
          <NuxtLink :to="link.path" active-class="font-bold" class="hover:underline">
            {{ link.title }}
          </NuxtLink>
        </template>
      </div>
    </div>

    <div>
      <TimeInTokyo/>
    </div>

    <!-- Mobile Menu Button -->
    <div class="flex md:hidden">
      <button class="text-gray-700 dark:text-gray-200 focus:outline-none" @click="mobileMenuOpen = !mobileMenuOpen">
        <Icon name="i-heroicons-bars-3" class="size-6"/>
      </button>
    </div>

    <!-- Social icons -->
    <div class="hidden md:flex text-gray-500 space-x-3">
      <a
          v-if="appConfig.socials?.twitter || appConfig.socials?.x"
          class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          :href="`https://x.com/${appConfig.socials?.twitter || appConfig.socials?.x}`"
          title="X"
      >
        <Icon class="size-5" name="i-simple-icons-x"/>
      </a>
      <a
          v-if="appConfig.socials?.github"
          class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          :href="`https://github.com/${appConfig.socials?.github}`"
          title="GitHub"
      >
        <Icon class="size-5" name="i-simple-icons-github"/>
      </a>
      <a
          v-if="appConfig.socials?.mastodon"
          class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          :href="`https://elk.zone/${appConfig.socials?.mastodon}`" title="Mastodon"
      >
        <Icon class="size-5" name="i-simple-icons-mastodon"/>
      </a>
      <a
          v-if="appConfig.socials?.bluesky"
          class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          :href="`https://bsky.app/profile/${appConfig.socials?.bluesky}`" title="Bluesky"
      >
        <Icon class="size-5" name="i-simple-icons-bluesky"/>
      </a>
      <ColorModeSwitch class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"/>
      <RssFeed />
    </div>
  </div>

  <!-- Mobile Navigation Menu -->
  <Disclosure
      v-show="mobileMenuOpen"
      as="nav"
      class="md:hidden bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg space-y-2">
    <div v-for="link in navigation" :key="link.path">
      <template v-if="link.children">
        <Disclosure>
          <DisclosureButton
              class="w-full flex justify-between items-center px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
            {{ link.title }}
            <Icon name="i-heroicons-chevron-down" class="size-4"/>
          </DisclosureButton>
          <DisclosurePanel class="pl-4 space-y-2">
            <NuxtLink
                v-for="child in link.children"
                :key="child.path"
                :to="child.path"
                class="block px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                active-class="font-bold"
                @click="closeMobileMenu"
            >
              {{ child.title }}
            </NuxtLink>
          </DisclosurePanel>
        </Disclosure>
      </template>
      <template v-else>
        <NuxtLink
            :to="link.path"
            class="block px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            active-class="font-bold"
            @click="closeMobileMenu"
        >
          {{ link.title }}
        </NuxtLink>
      </template>
    </div>
  </Disclosure>
</template>
