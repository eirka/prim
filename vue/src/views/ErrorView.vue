<script setup lang="ts">
import { computed } from 'vue';
import { getError } from '@/composables/useUtils';
import config from '@/config';

let errorcode = getError();

if (!errorcode) errorcode = 404;
if (errorcode === -1) errorcode = 502;

const errormessage = computed(() => {
  switch (errorcode) {
    case 401:
    case 403:
      return 'You are unauthorized to view this page';
    case 404:
      return "Couldn't find whatever you were looking for";
    case 502:
      return 'Oh no the API server is probably down';
    default:
      return 'Looks like something went wrong';
  }
});

const pageTitle = computed(() => {
  switch (errorcode) {
    case 401:
    case 403:
      return 'Unauthorized';
    case 404:
      return 'Not Found';
    case 502:
      return 'API Down';
    default:
      return 'Error';
  }
});

document.title = pageTitle.value + ' | ' + config.title;
</script>

<template>
  <div class="error">
    <div class="error_container">
      <div class="error_code">
        <span>Error</span>
        <span>{{ errorcode }}</span>
      </div>
      <div class="error_message">
        <span>{{ errormessage }}</span>
      </div>
    </div>
  </div>
</template>
