export default defineEventHandler(async (event) => {
  try {
    // Test basic functionality
    const test = {
      nitroWorks: true,
      timestamp: new Date().toISOString(),
      hasEnvClientId: !!process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV,
    }
    
    return { success: true, test }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message,
      stack: error.stack 
    }
  }
})
