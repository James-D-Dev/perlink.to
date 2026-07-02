import { ProfileRepository } from '../repositories/profileRepository'


function generateRandomString(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
}

export default eventHandler(async (event) => {
    const user = event.context.user

    if (!user) return {
        success: false,
        message: 'User not found'
    }

    const profileRepo = new ProfileRepository(event)

    let slug = ""
    if (user.email) {
        slug = user.email.replace(/[@.]/g, "_"); // Thay "@" và "." bằng "_"
    } else {
        slug = generateRandomString()
    }

    let ipData  = {
        ip: "Unknown",
        country: "Unknown"
    }

    ipData.ip = getHeader(event, 'x-forwarded-for') || getHeader(event, 'cf-connecting-ip') || 'Unknown';
  


    try {
        const data = await profileRepo.upsert({
            id: user.id,
            email: user.email,
            username: slug,
            ip: ipData.ip,
            country: ipData.country
        })

        return data
    } catch (error: any) {
        console.error('Lỗi:', error)
        return {
            success: false,
            message: error.message || 'Failed to upsert profile'
        }
    }
})