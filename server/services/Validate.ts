import { LINK_IMAGE } from "../../data/link-images"

const whiteListedRoutes = [
    'about',
    'contact',
    'login',
    'confirm',
    'cookie-notice',
    'privacy',
    'terms',
    'admin',
    'dashboard',
    'superadmin',
    'api',
    'tasks',
    '404'
]

export function shortCodeValidate(short_code: string) {
    if (!short_code) {
        return {
            success: false,
            isMissing: true,
            message: "Missing short_code"
        }
    }
    if (!short_code.trim()) {
        return {
            success: false,
            isMissing: true,
            message: "Missing short_code"
        }
    }
    if (whiteListedRoutes.includes(short_code)) {
        return {
            success: false,
            message: "Back-half is already taken"
        }
    }
    // Check length constraints (3-30 characters)
    if (short_code.length < 3 || short_code.length > 30) {
        return {
            success: false,
            message: "Back-half must be between 3 and 30 characters long"
        }
    }
    // Only allow letters, numbers, hyphens, and underscores
    const validShortCodePattern = /^[a-zA-Z0-9_-]+$/
    if (!validShortCodePattern.test(short_code)) {
        return {
            success: false,
            message: "Back-half can only contain letters, numbers, hyphens, and underscores"
        }
    }


    return {
        success: true
    }
}

export function tagValidate(text: string) {
    if (!text) {
        return {
            success: false,
            isMissing: true,
            message: "Missing tag"
        }
    }
    if (!text.trim()) {
        return {
            success: false,
            isMissing: true,
            message: "Missing tag"
        }
    }
    // Check length constraints (1-10 characters)
    if (text.length < 1 || text.length > 10) {
        return {
            success: false,
            message: "Tag must be between 1 and 10 characters long"
        }
    }
    // Only allow letters, numbers, hyphens, and underscores
    const validTagPattern = /^[a-zA-Z0-9_-]+$/
    if (!validTagPattern.test(text)) {
        return {
            success: false,
            message: "Tag can only contain letters, numbers, hyphens, and underscores"
        }
    }


    return {
        success: true
    }
}

export function imageValidate(text: string) {
    const isCorrect = Object.keys(LINK_IMAGE).includes(text)
    if (!isCorrect) {
        return {
            success: false,
            message: "Image is not valid"
        }
    }
    return {
        success: true
    }
}

export function titleValidate(text: string) {
    if (!text) {
        return {
            success: false,
            isMissing: true,
            message: "Title is missing"
        }
    }
    if (!text.trim()) {
        return {
            success: false, 
            isMissing: true,
            message: "Title is missing"
        }
    }
    if (text.length > 100) {
        return {
            success: false,
            message: "Title must be less than 100 characters"
        }
    }
    return {
        success: true
    }
}