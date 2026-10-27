<template>
  <UDashboardPanel id="users-create">
    <template #header>
      <UDashboardNavbar title="Create User">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton to="/superadmin/users" variant="ghost" color="neutral" icon="i-lucide-arrow-left" size="sm" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-2xl">
        <UCard :ui="{ header: 'px-6 py-4', body: 'p-6 sm:p-6' }">
          <template #header>
            <h2 class="font-medium text-highlighted">New user</h2>
            <p class="mt-1 text-sm text-muted">
              Creates an account in advance. The user signs in with Google using this email and gets this account.
            </p>
          </template>

          <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
            <UFormField label="Email" name="email" required>
              <UInput v-model="state.email" type="email" placeholder="name@example.com" icon="i-lucide-mail" class="w-full" autofocus />
            </UFormField>

            <UFormField label="Name" name="name">
              <UInput v-model="state.name" placeholder="Full name" class="w-full" />
            </UFormField>

            <UFormField label="Username" name="username" help="3–20 letters, numbers or underscores. Defaults to the email prefix.">
              <UInput v-model="state.username" placeholder="username" class="w-full" />
            </UFormField>

            <UFormField label="Plan" name="plan">
              <USelect v-model="state.plan" :items="PLAN_OPTIONS" class="w-full" />
            </UFormField>

            <div class="flex justify-end gap-2 pt-2">
              <UButton to="/superadmin/users" color="neutral" variant="ghost" label="Cancel" />
              <UButton type="submit" icon="i-lucide-user-plus" label="Create User" :loading="isSubmitting" />
            </div>
          </UForm>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { PLAN_OPTIONS } from '~/composables/usePlans'

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'light',
});

const toast = useToast();

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  name: z.string().trim().max(100).optional(),
  username: z.string().trim().regex(/^[a-zA-Z0-9_]{3,20}$/, '3–20 letters, numbers or underscores').optional().or(z.literal('')),
  plan: z.enum(['free', 'starter', 'plus', 'pro']),
});

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  name: '',
  username: '',
  plan: 'free',
});

const isSubmitting = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true;
  try {
    const { email, name, username, plan } = event.data;
    const response = await $fetch('/api/superadmin/users', {
      method: 'POST' as any,
      body: { email, plan, name: name || undefined, username: username || undefined },
    }) as { id: string };
    toast.add({ title: 'User created', description: email, color: 'success' });
    await navigateTo(`/superadmin/users/${response.id}`);
  } catch (error: any) {
    toast.add({
      title: 'Failed to create user',
      description: error?.data?.statusMessage || error?.statusMessage,
      color: 'error',
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
