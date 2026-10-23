<template>
  <UDashboardPanel id="admin-create">
    <template #header>
      <UDashboardNavbar title="Create new">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div
        class="relative z-10 container max-w-3xl mx-auto px-2 md:px-4 py-4 md:py-8 flex flex-col space-y-6"
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

      <ModalsLinkReadyModal
        v-model:open="showSuccessModal"
        :short-code="createdShortCode"
        @view-details="navigateTo(`/dashboard/links/${createdShortCode}`)"
      />
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
  ssr: false,
});
const { user } = useUserSession();
const route = useRoute();
const toast = useToast();

import { useDebounceFn } from "@vueuse/core";
import { LINK_IMAGE } from "../../../data/link-images";
import type { ApiLinkResponse, ApiResponse } from "../../../types/response";

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

async function addLink() {
  if (!validateUrl(newLink.value)) return;
  if (isCustomShortCode.value && !shortCodeAvailable.value) return;

  isLoading.value = true;
  try {
    const res = await $fetch<ApiLinkResponse>("/api/links", {
      method: "POST",
      body: {
        content: newLink.value,
        short_code: shortCodeAvailable.value ? newShortCode.value : undefined,
        title: linkTitle.value,
        image: linkImage.value,
      },
    });

    if (res.success && res.data) {
      // Reset form
      newLink.value = "";
      newShortCode.value = "";
      linkTitle.value = "";
      isCustomShortCode.value = false;
      shortCodeAvailable.value = false;

      // Navigate to link details with new=true query
      navigateTo(`/dashboard/links/${res.data.short_code}?new=true`);
    }
  } catch (error: any) {
    console.error("Error creating link:", error);
    toast.add({
      title: "Error",
      description: error.message || "Failed to create link",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

function preloadShortCode() {
  if (slug.value) {
    newShortCode.value = slug.value;
    debounceCheckShortCode();
  }
}

// Check auth and select type
async function selectType(type: "bio" | "short") {
  // Check if user is logged in
  const { loggedIn } = useUserSession();

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

// Create bio link
async function createBioLink() {
  if (!slug.value) return;

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
  if (!newLink.value) return;

  if (!validateUrl(newLink.value)) return;


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
        short_code: slug.value || undefined,
        title: linkTitle.value || undefined,
        image: linkImage.value,
      },
    });

    if (res.success && "data" in res && res.data) {
      createdShortCode.value = res.data.short_code;
      showSuccessModal.value = true;
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
