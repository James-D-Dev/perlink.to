import type { Ref } from 'vue';
import type { BioBlock, LinksBlock, SocialBlock, VietQRBlock, ImageAlbumBlock, BirthdayCountdownBlock, BioLink, SocialLink, VietQRInfo, ImageAlbumLayout } from '~/types/bio';

// Image album image type from block
interface ImageAlbumImage {
  id: string;
  url: string;
  alt?: string;
  index?: number;
}

export interface UseBioBlockOptions {
  blocks: Ref<BioBlock[]>;
}

export function useBioBlock({ blocks }: UseBioBlockOptions) {
  // Helper: Get block by name
  const getBlock = <T extends BioBlock>(name: T['name']): T | undefined => {
    return blocks.value.find(b => b.name === name) as T | undefined;
  };

  // Helper: Create or update block
  const setBlock = <T extends BioBlock>(name: BioBlock['name'], data: T['data']): void => {
    const existingIndex = blocks.value.findIndex(b => b.name === name);
    
    if (existingIndex >= 0) {
      // Update existing block
      blocks.value[existingIndex] = {
        ...blocks.value[existingIndex],
        data,
      } as T;
    } else {
      // Create new block
      const newBlock: BioBlock = {
        name,
        index: blocks.value.length,
        hidden: false,
        data,
      } as BioBlock;
      blocks.value.push(newBlock);
    }
  };

  // Helper: Toggle block hidden state
  const toggleBlockHidden = (name: BioBlock['name']): void => {
    const block = blocks.value.find(b => b.name === name);
    if (block) {
      block.hidden = !block.hidden;
    }
  };

  // Helper: Remove block
  const removeBlock = (name: BioBlock['name']): void => {
    const index = blocks.value.findIndex(b => b.name === name);
    if (index >= 0) {
      blocks.value.splice(index, 1);
    }
  };

  // ============ Links Block ============
  const linksBlock = computed<LinksBlock | undefined>(() => getBlock('links'));
  
  const links = computed<BioLink[]>(() => linksBlock.value?.data.items ?? []);
  
  const setLinks = (items: BioLink[]): void => {
    setBlock<LinksBlock>('links', { items });
  };

  const addLink = (link: BioLink): void => {
    const current = links.value;
    setLinks([...current, link]);
  };

  const removeLink = (index: number): void => {
    const current = [...links.value];
    current.splice(index, 1);
    setLinks(current);
  };

  const updateLink = (index: number, updates: Partial<BioLink>): void => {
    const current = [...links.value];
    if (current[index]) {
      current[index] = { ...current[index], ...updates };
      setLinks(current);
    }
  };

  // ============ Social Block ============
  const socialBlock = computed<SocialBlock | undefined>(() => getBlock('social'));
  
  const socialLinks = computed<SocialLink[]>(() => socialBlock.value?.data.links ?? []);
  
  const setSocialLinks = (links: SocialLink[]): void => {
    setBlock<SocialBlock>('social', { links });
  };

  const addSocialLink = (link: SocialLink): void => {
    const current = socialLinks.value;
    setSocialLinks([...current, link]);
  };

  const removeSocialLink = (id: string): void => {
    const current = socialLinks.value.filter(s => s.id !== id);
    setSocialLinks(current);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>): void => {
    const current = socialLinks.value.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    setSocialLinks(current);
  };

  const moveSocialLink = (fromIndex: number, toIndex: number): void => {
    const current = [...socialLinks.value];
    const [moved] = current.splice(fromIndex, 1);
    if (moved) {
      current.splice(toIndex, 0, moved);
      // Reindex
      const reindexed = current.map((s, i) => ({ ...s, index: i }));
      setSocialLinks(reindexed);
    }
  };

  // ============ VietQR Block ============
  const vietQRBlock = computed<VietQRBlock | undefined>(() => getBlock('vietqr'));
  
  const vietQRData = computed<VietQRInfo | null>(() => vietQRBlock.value?.data ?? null);
  
  const setVietQR = (data: VietQRInfo): void => {
    setBlock<VietQRBlock>('vietqr', data);
  };

  const removeVietQR = (): void => {
    removeBlock('vietqr');
  };

  // ============ Image Album Block ============
  const imageAlbumBlock = computed<ImageAlbumBlock | undefined>(() => getBlock('image-album'));
  
  const albumImages = computed<ImageAlbumImage[]>(() => imageAlbumBlock.value?.data.images ?? []);
  
  const albumLayout = computed<ImageAlbumLayout>(() => imageAlbumBlock.value?.data.layout ?? 'vertical');

  // ============ Birthday Countdown Block ============
  const birthdayCountdownBlock = computed<BirthdayCountdownBlock | undefined>(() => getBlock('birthday-countdown'));
  
  const birthdayCountdownData = computed<BirthdayCountdownBlock['data'] | null>(() => birthdayCountdownBlock.value?.data ?? null);
  
  const setImageAlbum = (images: ImageAlbumImage[], layout: ImageAlbumLayout): void => {
    setBlock<ImageAlbumBlock>('image-album', { images, layout } as any);
  };

  const addImage = (image: ImageAlbumImage): void => {
    const current = albumImages.value;
    setImageAlbum([...current, image], albumLayout.value);
  };

  const removeImage = (id: string): void => {
    const current = albumImages.value.filter(img => img.id !== id);
    setImageAlbum(current, albumLayout.value);
  };

  const setLayout = (layout: ImageAlbumLayout): void => {
    setImageAlbum(albumImages.value, layout);
  };

  // ============ Generic Block Visibility ============
  const isBlockHidden = (name: BioBlock['name']): boolean => {
    const block = getBlock(name);
    return block?.hidden ?? false;
  };

  const toggleBlockVisibility = (name: BioBlock['name']): void => {
    const block = getBlock(name);
    if (block) {
      block.hidden = !block.hidden;
    }
  };

  const setBlockIndex = (name: BioBlock['name'], index: number): void => {
    const block = getBlock(name);
    if (block) {
      block.index = index;
    }
  };

  return {
    // Generic
    getBlock,
    setBlock,
    removeBlock,
    isBlockHidden,
    toggleBlockVisibility,
    setBlockIndex,
    
    // Links
    links,
    linksBlock,
    setLinks,
    addLink,
    removeLink,
    updateLink,
    
    // Social
    socialLinks,
    socialBlock,
    setSocialLinks,
    addSocialLink,
    removeSocialLink,
    updateSocialLink,
    moveSocialLink,
    
    // VietQR
    vietQRData,
    vietQRBlock,
    setVietQR,
    removeVietQR,
    
    // Image Album
    albumImages,
    albumLayout,
    imageAlbumBlock,
    setImageAlbum,
    addImage,
    removeImage,
    setLayout,

    // Birthday Countdown
    birthdayCountdownBlock,
    birthdayCountdownData,

    // Block helpers
    toggleBlockHidden,
  };
}
