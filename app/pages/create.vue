<template>
  <div class="min-h-screen bg-slate-100 relative overflow-hidden">
    <div class="h-[4rem] md:h-[6rem]"></div>
    <div
      class="relative z-10 container max-w-3xl mx-auto px-2 md:px-4 py-4 flex flex-col space-y-6"
    >
     
      <FeaturesCreateLinkCards
        :slug="slug"
        v-model:url="newLink"
        :url-error="urlError"
        :bio-loading="isLoading"
        :short-loading="isLoading"
        @create-bio="createBioLink"
        @create-short="createShortLink"
      />
    </div>
  </div>

  <ModalsLinkReadyModal
    v-model:open="showSuccessModal"
    :short-code="createdShortCode"
    @view-details="navigateTo(`/dashboard/links/${createdShortCode}`)"
  />

  <!-- Login Modal -->
  <UModal v-model:open="showLoginModal" title="Sign in to continue">
    <template #body>
      <p class="text-sm text-muted text-center">
        You need to sign in to create your link
      </p>
    </template>
    <template #footer>
      <div class="flex flex-col gap-3 w-full">
        <UButton
          size="lg"
          color="primary"
          variant="solid"
          block
          @click="redirectToLogin"
        >
          <UIcon name="i-lucide-google" class="w-5 h-5" />
          Continue with Google
        </UButton>
        <UButton
          color="neutral"
          variant="ghost"
          block
          @click="showLoginModal = false"
        >
          Cancel
        </UButton>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "default",
});
const { user, loggedIn } = useUserSession();
const route = useRoute();
const toast = useToast();

import { useDebounceFn } from "@vueuse/core";
import type { ApiLinkResponse } from "../../types/response";



const newLink = ref("");
const newShortCode = ref("");
const linkTitle = ref("");
const linkImage = ref("p1");
const profile = ref<any>({});
const showSuccessModal = ref(false);
const createdShortCode = ref("");
const selectedType = ref<"bio" | "short" | null>(null);
const showLoginModal = ref(false);

// Get slug from query
const slug = computed(() => {
  const input = route.query.input;
  return typeof input === "string" ? input : "";
});

// Form state
const isCustomShortCode = ref(false);
const isLoading = ref(false);
const isCheckingShortCode = ref(false);
const shortCodeAvailable = ref(false);
const shortCodeError = ref("");
const urlError = ref("");

// Validate URL
const validateUrl = (url: string) => {
  try {
    new URL(url);
    urlError.value = "";
    return true;
  } catch (error: any) {
    console.error("URL validation error:", error);
    urlError.value = "Please enter a valid URL";
    return false;
  }
};

// Debounced short code check
const debounceCheckShortCode = useDebounceFn(async () => {
  if (!newShortCode.value) {
    shortCodeError.value = "";
    shortCodeAvailable.value = false;
    return;
  }

  isCheckingShortCode.value = true;
  shortCodeError.value = "";
  shortCodeAvailable.value = false;

  try {
    const response = await $fetch("/api/check_short_code_exists", {
      method: "POST",
      body: { short_code: newShortCode.value },
    });

    if (!response.success) {
      shortCodeError.value =
        response.message || "This back-half is already taken";
      shortCodeAvailable.value = false;
    } else {
      shortCodeAvailable.value = true;
    }
  } catch (error: any) {
    shortCodeError.value =
      error.message || "Error checking short code availability";
  } finally {
    isCheckingShortCode.value = false;
  }
}, 500);

const fetchProfile = async () => {
  const data = await $fetch("/api/profile");
  profile.value = data || [];
};

function preloadShortCode() {
  if (slug.value) {
    newShortCode.value = slug.value;
    debounceCheckShortCode();
  }
}

// Check auth and select type
async function selectType(type: "bio" | "short") {
  if (!loggedIn.value) {
    showLoginModal.value = true;
    // Store the intended action
    localStorage.setItem("pendingLinkType", type);
    return;
  }

  selectedType.value = type;

  // Pre-fill short code if coming from home page
  if (type === "short") {
    setTimeout(() => {
      preloadShortCode();
    }, 100);
  }
}

// Redirect to login
function redirectToLogin() {
  const redirectUrl = `/dashboard/create?input=${encodeURIComponent(slug.value)}`;
  navigateTo(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
}

// Create bio link
async function createBioLink() {
  if (!slug.value) return;

  // Check auth first
  if (!loggedIn.value) {
    showLoginModal.value = true;
    localStorage.setItem("pendingLinkType", "bio");
    return;
  }

  isLoading.value = true;
  try {
    const res = await $fetch("/api/bio", {
      method: "POST",
      body: {
        username: slug.value,
        title: "Your Name",
        description: "",
      },
    });

    if (res.success && res.bioPage) {
      navigateTo(`/dashboard/bio/${res.bioPage.username}`);
    }
  } catch (error: any) {
    console.error("Error creating bio:", error);
    toast.add({
      title: "Error",
      description: error.message || "Failed to create bio page",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

// Create short link
async function createShortLink() {
  if (!slug.value || !newLink.value) return;

  // Validate URL
  if (!validateUrl(newLink.value)) return;

  // Check auth first
  if (!loggedIn.value) {
    showLoginModal.value = true;
    localStorage.setItem("pendingLinkType", "short");
    return;
  }

  // Check if slug/short_code is available before creating
  if (slug.value) {
    try {
      const checkRes = await $fetch("/api/check_short_code_exists", {
        method: "POST",
        body: { short_code: slug.value },
      });
      if (!checkRes.success) {
        toast.add({
          title: "Short code unavailable",
          description: "This short code is already taken. Please choose another one.",
          color: "error",
        });
        return;
      }
    } catch (error) {
      // Continue anyway if check fails
    }
  }

  isLoading.value = true;
  try {
    const res = await $fetch("/api/links", {
      method: "POST",
      body: {
        content: newLink.value,
        short_code: slug.value,
        title: linkTitle.value || undefined,
        image: linkImage.value,
      },
    });

    if (res.success && "data" in res && res.data) {
      navigateTo(`/dashboard/links/${res.data.short_code}`);
    }
  } catch (error: any) {
    console.error("Error creating short link:", error);
    toast.add({
      title: "Error",
      description: error.message || "Failed to create short link",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchProfile();

  // Check if there's a pending action after login
  const pendingType = localStorage.getItem("pendingLinkType");
  if (pendingType) {
    localStorage.removeItem("pendingLinkType");
    selectedType.value = pendingType as "bio" | "short";
    if (pendingType === "short") {
      setTimeout(() => {
        preloadShortCode();
      }, 100);
    }
  }
});
</script>
