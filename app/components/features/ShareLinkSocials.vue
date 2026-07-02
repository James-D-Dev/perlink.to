<template>
    <div class="w-full">
        <UCarousel
            v-slot="{ item }"
            :items="socials"
            :ui="{
                item: 'basis-1/5 min-w-[60px]',
                container: 'gap-2'
            }"
            arrows
            class="w-full"
        >
            <div class="flex flex-col items-center group hover:text-perlink-blue">
                <ULink
                    :to="item.generateLink()"
                    target="_blank"
                    class="flex flex-col items-center p-3 rounded-lg hover:bg-perlink-blue/10 border group-hover:border-perlink-blue"
                >
                    <UIcon :name="item.icon" class="size-8 text-foreground" />
                </ULink>
                <div class="text-xs mt-2">{{ item.name }}</div>
            </div>
        </UCarousel>
    </div>
</template>
<script setup lang="ts">

const props = defineProps<{
    shortCode: string
}>()

const shortLink = computed(() => {
        return props.shortCode
})

const socials = computed(() => {
    return [
    {
        name: 'Facebook',
        icon: 'logos:facebook',
        generateLink: () => {
            return `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(`${shortLink.value}`)}`
        }
    },
    {
        name: 'X (Twitter)',
        icon: 'prime:twitter',
        generateLink: () => {
            return `https://x.com/intent/tweet?url=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
        }
    },
    {
        name: 'Instagram',
        icon: 'skill-icons:instagram',
        generateLink: () => {
            return `https://www.instagram.com/share?url=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
        }
    },
    {
        name: 'Threads',
        icon: 'ph:threads-logo-bold',
        generateLink: () => {
            return `https://www.threads.net/intent/post?text=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
        }
    },
    {
        name: "WhatsApp",
        icon: "logos:whatsapp-icon",
        generateLink: () => {
            return `https://wa.me/?text=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
        }
    },
    {
        name: "Mail",
        icon: "material-symbols:mail-outline",
        generateLink: () => {
            return `mailto:${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
        }
    },
    {
        name: "TikTok",
        icon: "logos:tiktok-icon",
        generateLink: () => {
            return `https://www.tiktok.com`
        }
    },
    {
        name: "LinkedIn",
        icon: "skill-icons:linkedin",
        generateLink: () => {
            return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
        }
    },
    {
        name: "Reddit",
        icon: "logos:reddit-icon",
        generateLink: () => {
            return `https://www.reddit.com/submit?url=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}&title=Check out this link shortened with Perlink`
        }
    },
    {
        name: "YouTube",
        icon: "logos:youtube-icon",
        generateLink: () => {
            return `https://www.youtube.com`
        }
    },
    {
        name: "Telegram",
        icon: "logos:telegram",
        generateLink: () => {
            return `https://t.me/share/url?url=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
        }
    },
    {
        name: "Messenger",
        icon: "logos:messenger",
        generateLink: () => {
            // return `https://m.me/?text=${encodeURI(`Check out this link shortened with Perlink\n${shortLink.value}`)}`
            // return `https://www.messenger.com/share?link=${encodeURI(`${shortLink.value}`)}`
            return `https://www.messenger.com`
        }
    },
]
})
</script>