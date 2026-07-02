import { getDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  
  // Require authentication
  if (!user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }
  
  // Validate required fields
  if (!body.subject || !body.message) {
    return {
      success: false,
      message: "Subject and message are required",
    };
  }
  
  // Validate type
  const validTypes = ['general', 'bug', 'feature', 'improvement', 'other'];
  const type = body.type || 'general';
  if (!validTypes.includes(type)) {
    return {
      success: false,
      message: "Invalid feedback type",
    };
  }
  
  // Validate rating if provided
  const rating = body.rating ? parseInt(body.rating) : null;
  if (rating !== null && (rating < 1 || rating > 5)) {
    return {
      success: false,
      message: "Rating must be between 1 and 5",
    };
  }
  
  const db = getDB(event);
  
  try {
    const result = await db
      .prepare(`
        INSERT INTO feedback (user_id, type, subject, message, rating, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
      `)
      .bind(
        user.id,
        type,
        body.subject,
        body.message,
        rating
      )
      .run();
    
    return {
      success: true,
      message: "Feedback submitted successfully",
      data: {
        type,
        subject: body.subject,
        message: body.message,
        rating,
        status: 'pending',
      }
    };
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit feedback",
    });
  }
});
