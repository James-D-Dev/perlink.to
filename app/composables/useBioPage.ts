import type { BioData, BioLink, Template, ThemeConfig } from '~/types/bio';
import { DEFAULT_THEME } from '~/types/bio';

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Gradient",
    description: "Clean with gradient accents",
    previewClass: "bg-gradient-to-br from-cyan-400 to-blue-500",
    avatarClass: "bg-white/30",
    lineClass: "bg-white/50",
    buttonClass: "bg-white/20",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and elegant",
    previewClass: "bg-white",
    avatarClass: "bg-gray-200",
    lineClass: "bg-gray-300",
    buttonClass: "bg-gray-100 border border-gray-200",
  },
  {
    id: "creative",
    name: "Creative Cards",
    description: "Card-based layout",
    previewClass: "bg-purple-50",
    avatarClass: "bg-purple-200",
    lineClass: "bg-purple-300",
    buttonClass: "bg-purple-500",
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Sleek dark theme",
    previewClass: "bg-gray-900",
    avatarClass: "bg-gray-700",
    lineClass: "bg-gray-600",
    buttonClass: "bg-gray-800 border border-gray-700",
  },
];

export function useBioPage() {
  const toast = useToast();

  // State
  const loading = ref(true);
  const step = ref<"template" | "edit">("template");
  const existingBio = ref<any>(null);

  // Block-based editor state
  const activeBlock = ref<string | null>("header");
  const showAddBlock = ref(false);

  const selectedTemplate = ref("modern");
  const username = ref("");
  const usernameError = ref("");
  const usernameAvailable = ref(false);
  const creating = ref(false);
  const saving = ref(false);
  const publishing = ref(false);

  const bioData = reactive<BioData>({
    title: "",
    bio: "",
    avatarUrl: "",
    templateId: "modern",
    themeConfig: { ...DEFAULT_THEME },
    links: [],
    socialLinks: {},
  });

  // Computed
  const canProceed = computed(() => {
    return (
      username.value.length >= 3 &&
      usernameAvailable.value &&
      !usernameError.value
    );
  });

  const previewData = computed(() => ({
    username: username.value,
    title: bioData.title,
    bio: bioData.bio,
    avatarUrl: bioData.avatarUrl,
    templateId: bioData.templateId,
    links: bioData.links.filter((l) => l.isActive),
    socialLinks: bioData.socialLinks,
    themeConfig: bioData.themeConfig,
  }));

  // Methods
  const selectTemplate = (id: string) => {
    selectedTemplate.value = id;
    bioData.templateId = id;
  };

  const toggleBlock = (blockId: string) => {
    activeBlock.value = activeBlock.value === blockId ? null : blockId;
  };

  const checkUsername = async () => {
    if (username.value.length < 3) {
      usernameError.value = "Username must be at least 3 characters";
      usernameAvailable.value = false;
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username.value)) {
      usernameError.value =
        "Only letters, numbers, underscore and hyphen allowed";
      usernameAvailable.value = false;
      return;
    }

    try {
      const { available } = await $fetch(`/api/bio/check-username`, {
        params: { username: username.value },
      }) as { available: boolean };
      usernameAvailable.value = available;
      usernameError.value = available ? "" : "Username is already taken";
    } catch (error) {
      usernameError.value = "Error checking username";
    }
  };

  const createBioPage = async () => {
    if (!canProceed.value) return;

    creating.value = true;
    try {
      const response = await $fetch("/api/bio", {
        method: "POST",
        body: {
          username: username.value,
          templateId: selectedTemplate.value,
        },
      });

      existingBio.value = response;
      step.value = "edit";
      toast.add({
        title: "Success",
        description: "Bio page created!",
        color: "success",
      });
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.data?.statusMessage || "Failed to create bio page",
        color: "error",
      });
    } finally {
      creating.value = false;
    }
  };

  const addLink = () => {
    const newLink: BioLink = {
      id: crypto.randomUUID(),
      title: "",
      url: "",
      icon: "link",
      order: bioData.links.length,
      isActive: true,
    };
    bioData.links.push(newLink);
  };

  const removeLink = (index: number) => {
    bioData.links.splice(index, 1);
  };

  const saveBio = async () => {
    saving.value = true;
    try {
      await $fetch("/api/bio", {
        method: "PUT",
        body: {
          ...bioData,
          links: bioData.links.map((link, index) => ({
            ...link,
            order: index,
          })),
        },
      });

      toast.add({
        title: "Saved",
        description: "Your bio page has been saved",
        color: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Failed to save",
        color: "error",
      });
    } finally {
      saving.value = false;
    }
  };

  const publishBio = async () => {
    publishing.value = true;
    try {
      await $fetch("/api/bio/publish", {
        method: "POST",
      });

      if (existingBio.value) {
        existingBio.value.isPublished = true;
      }

      toast.add({
        title: "Published",
        description: "Your bio page is now live!",
        color: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Failed to publish",
        color: "error",
      });
    } finally {
      publishing.value = false;
    }
  };

  const sharePage = async () => {
    const url = `https://perlink.to/${username.value}`;
    try {
      await navigator.share({
        title: bioData.title || "Your Name",
        url: url,
      });
    } catch (err) {
      await navigator.clipboard.writeText(url);
      toast.add({
        title: "Copied!",
        description: "URL copied to clipboard",
        color: "success",
      });
    }
  };

  const copyUrl = () => {
    const url = `https://perlink.to/${existingBio.value?.username || username.value}`;
    navigator.clipboard.writeText(url);
    toast.add({
      title: "Copied!",
      description: "URL copied to clipboard",
      color: "success",
    });
  };

  // Load existing bio on mount
  const loadBio = async () => {
    try {
      const res = await $fetch("/api/bio");
      const bio = res.bioPage;
      if (res.exists && bio) {
        existingBio.value = bio;
        username.value = bio.username;
        selectedTemplate.value = bio.templateId;

        bioData.title = bio.title || "";
        bioData.bio = bio.bio || "";
        bioData.avatarUrl = bio.avatarUrl || "";
        bioData.templateId = bio.templateId;
        bioData.links = bio.links || [];
        bioData.socialLinks = bio.socialLinks || {};

        if (bio.themeConfig) {
          bioData.themeConfig = {
            colors:     { ...bioData.themeConfig.colors,     ...(bio.themeConfig.colors     || {}) },
            background: { ...bioData.themeConfig.background, ...(bio.themeConfig.background || {}) },
            card:       { ...bioData.themeConfig.card,       ...(bio.themeConfig.card       || {}) },
            button:     { ...bioData.themeConfig.button,     ...(bio.themeConfig.button     || {}) },
            header:     { ...bioData.themeConfig.header,     ...(bio.themeConfig.header     || {}) },
            avatar:     { ...bioData.themeConfig.avatar,     ...(bio.themeConfig.avatar     || {}) },
            link:       { ...bioData.themeConfig.link,       ...((bio.themeConfig as any).link || {}) },
            typography: { ...bioData.themeConfig.typography, ...(bio.themeConfig.typography || {}) },
          } as ThemeConfig;
        }

        step.value = "edit";
      }
    } catch (error) {
      // No existing bio
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    loading,
    step,
    existingBio,
    activeBlock,
    showAddBlock,
    selectedTemplate,
    username,
    usernameError,
    usernameAvailable,
    creating,
    saving,
    publishing,
    bioData,
    // Computed
    canProceed,
    previewData,
    // Methods
    selectTemplate,
    toggleBlock,
    checkUsername,
    createBioPage,
    addLink,
    removeLink,
    saveBio,
    publishBio,
    sharePage,
    copyUrl,
    loadBio,
    templates,
  };
}
