import { LINK_IMAGE } from "../../data/link-images";

export function getBannerImage(url: string): string {
    try {
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        const urlObj = new URL(url);
        let hostname = urlObj.hostname.replace(/\./g, "_");

        // docs.google.com
        if (hostname === "docs_google_com") {
            let path = urlObj.pathname.split("/").filter(Boolean)[0];
            if (path) {
                return `docs_google_com_${path}.png`;
            } else {
                return `docs_google_com.png`;
            }
        }

        return `${hostname}.png`;
    } catch (error) {
        return "link.png"; // Return default image if error
    }
}


export const getImageUrl = (text: string | null) => {
    const imgKey = text ?? 'p1'
    const isCorrect = Object.keys(LINK_IMAGE).includes(imgKey)

    if (!isCorrect) return LINK_IMAGE.p1

    return (LINK_IMAGE as any)[imgKey]
}