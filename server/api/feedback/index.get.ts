import { getDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);
  
  // Require authentication
  if (!user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }
  
  const db = getDB(event);
  
  try {
    // Get user's own feedback only (not admin view)
    let sql = `
      SELECT 
        f.id,
        f.type,
        f.subject,
        f.message,
        f.rating,
        f.status,
        f.created_at,
        f.updated_at
      FROM feedback f
      WHERE f.user_id = ?
    `;
    
    // Filter by status if provided
    const params: any[] = [user.id];
    if (query.status) {
      sql += ` AND f.status = ?`;
      params.push(query.status);
    }
    
    // Order by newest first
    sql += ` ORDER BY f.created_at DESC`;
    
    // Add limit if provided
    if (query.limit) {
      sql += ` LIMIT ?`;
      params.push(parseInt(query.limit as string));
    }
    
    const result = await db.prepare(sql).bind(...params).all();
    
    return {
      success: true,
      data: result.results || []
    };
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch feedback",
    });
  }
});
