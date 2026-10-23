<template>
  <UDashboardPanel id="help">
    <template #header>
      <UDashboardNavbar title="Help & Support">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-3xl mx-auto py-8 px-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Help & Support</h1>

        <UCard class="mb-6">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">
                <UIcon name="i-lucide-mail" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Contact Support</h2>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Get in touch with our team</p>
              </div>
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="sendEmail">
            <UFormField label="Your Name" required>
              <UInput
                v-model="form.name"
                placeholder="Enter your name"
                class="w-full"
                required
              />
            </UFormField>

            <UFormField label="Your Email" required>
              <UInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                class="w-full"
                required
              />
            </UFormField>

            <UFormField label="Subject" required>
              <UInput
                v-model="form.subject"
                placeholder="What is this about?"
                class="w-full"
                required
              />
            </UFormField>

            <UFormField label="Message" required>
              <UTextarea
                v-model="form.message"
                placeholder="Describe your issue or question..."
                class="w-full"
                rows="5"
                required
              />
            </UFormField>

            <div class="flex items-center justify-end gap-3 pt-4">
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                @click="resetForm"
              >
                Clear
              </UButton>
              <UButton
                type="submit"
                color="primary"
                :loading="sending"
                :disabled="!isFormValid"
              >
                <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
                Send Message
              </UButton>
            </div>
          </form>
        </UCard>

        <!-- FAQ Section -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/15 flex items-center justify-center">
                <UIcon name="i-lucide-help-circle" class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Quick answers to common questions</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-100 dark:border-white/5 last:border-0 pb-4 last:pb-0">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">{{ faq.question }}</h3>
              <p class="text-sm text-gray-600 dark:text-neutral-300">{{ faq.answer }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: "dark",
  layout: "admin",
  middleware: "auth",
});

const toast = useToast();
const { user } = useUserSession();

const form = ref({
  name: user.value?.name || "",
  email: user.value?.email || "",
  subject: "",
  message: "",
});

const sending = ref(false);

const isFormValid = computed(() => {
  return form.value.name && form.value.email && form.value.subject && form.value.message;
});

const faqs = [
  {
    question: "How do I create a short link?",
    answer: "Go to the Create page, enter your long URL, and optionally customize your short code. Then click 'Create Short Link'."
  },
  {
    question: "How do I create a bio page?",
    answer: "Navigate to the Bio section, enter your desired username, and click 'Create Bio Page'. You can then customize your page with themes, links, and more."
  },
  {
    question: "Can I edit my links after creating them?",
    answer: "Yes! Go to your Links dashboard, find the link you want to edit, and click on it to view and modify its details."
  },
  {
    question: "How do I track link clicks?",
    answer: "Each link has an analytics page showing click statistics, geographic data, and referral sources."
  },
  {
    question: "Is there a limit to how many links I can create?",
    answer: "Free accounts have generous limits. Check your account settings for current usage and upgrade options if needed."
  }
];

function resetForm() {
  form.value = {
    name: user.value?.name || "",
    email: user.value?.email || "",
    subject: "",
    message: "",
  };
}

async function sendEmail() {
  if (!isFormValid.value) return;

  sending.value = true;

  // Create mailto link with pre-filled content
  const mailtoLink = `mailto:kimduc10a@gmail.com?subject=${encodeURIComponent(
    `[Perlink Support] ${form.value.subject}`
  )}&body=${encodeURIComponent(
    `Name: ${form.value.name}\nEmail: ${form.value.email}\n\nMessage:\n${form.value.message}`
  )}`;

  // Open default email client
  window.location.href = mailtoLink;

  toast.add({
    title: "Email client opened",
    description: "Please send your message from your email app",
    color: "success",
  });

  resetForm();
  sending.value = false;
}
</script>
