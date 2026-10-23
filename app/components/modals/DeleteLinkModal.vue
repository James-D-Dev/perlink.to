<template>
  <UModal
    :open="open"
    @update:open="$emit('update:open', false)"
    title="Delete Link"
    description="Are you sure you want to delete this link? This action cannot be undone."
  >
    <template #body>
      <div class="flex justify-end space-x-2 pt-4">
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
        <Button
          variant="destructive"
          :loading="isDeleting"
          @click="handleDelete"
        >
          <Icon v-if="!isDeleting" name="ph:trash-bold" class="w-4 h-4 mr-2" />
          <UIcon v-else name="ph:spinner-gap" class="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  open: boolean;
  shortCode: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const router = useRouter();
const toast = useToast();
const isDeleting = ref(false);

const handleDelete = async () => {
  try {
    isDeleting.value = true;
    const res: any = await $fetch(`/api/links/${props.shortCode}`, {
      method: "DELETE",
    });

    if (!res.success) {
      toast.add({
        title: "Error",
        description: res.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Link deleted",
      description: "The link has been successfully deleted",
    });

    // Close modal and redirect to links list
    emit("update:open", false);
    router.push("/dashboard/create");
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to delete link. Please try again.",
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>
