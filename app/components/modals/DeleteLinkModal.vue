<template>
  <UModal
    :open="open"
    @update:open="$emit('update:open', false)"
    :title="t('blocks.deleteLink.title')"
    :description="t('blocks.deleteLink.description')"
  >
    <template #body>
      <div class="flex justify-end space-x-2 pt-4">
        <Button variant="outline" @click="$emit('update:open', false)">
          {{ t('common.cancel') }}
        </Button>
        <Button
          variant="destructive"
          :loading="isDeleting"
          @click="handleDelete"
        >
          <Icon v-if="!isDeleting" name="ph:trash-bold" class="w-4 h-4 mr-2" />
          <UIcon v-else name="ph:spinner-gap" class="w-4 h-4 mr-2" />
          {{ t('common.delete') }}
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
const { t } = useI18n();
const isDeleting = ref(false);

const handleDelete = async () => {
  try {
    isDeleting.value = true;
    const res: any = await $fetch(`/api/links/${props.shortCode}`, {
      method: "DELETE",
    });

    if (!res.success) {
      toast.add({
        title: t("blocks.deleteLink.errorTitle"),
        description: res.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: t("blocks.deleteLink.deletedTitle"),
      description: t("blocks.deleteLink.deletedDescription"),
    });

    // Close modal and redirect to links list
    emit("update:open", false);
    router.push("/dashboard/create");
  } catch (error) {
    toast.add({
      title: t("blocks.deleteLink.errorTitle"),
      description: t("blocks.deleteLink.failed"),
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>
