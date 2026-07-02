import {
  imageValidate,
  shortCodeValidate,
  titleValidate,
} from "../../services/Validate";
import { LinkRepository } from "../../repositories/linkRepository";

interface LinkBody {
  content: string;
  short_code: string;
  title: string | null;
  image: string | null;
}

function generateRandomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
}

export default defineEventHandler(async (event) => {
  const body: LinkBody | undefined = await readBody(event);
  const user = event.context.user;

  if (!user)
    return {
      success: false,
      message: "User not found",
    };

  if (!body)
    return {
      success: false,
      message: "Body is required",
    };

  const linkRepo = new LinkRepository(event);
  const validate = shortCodeValidate(body.short_code);
  if (!validate.success && !validate.isMissing) {
    return validate;
  }

  // image validate
  if (body.image) {
    const validateImg = imageValidate(body.image);
    if (!validateImg.success) {
      return validateImg;
    }
  }
  //

  let is_custom = true;
  let slug = body.short_code;
  if (!body.short_code) {
    slug = generateRandomString();
    is_custom = false;
  }

  if (body.title) {
    const validateTitle = titleValidate(body.title);
    if (!validateTitle.success) {
      return {
        success: false,
        message: validateTitle.message,
      };
    }
  }

  try {
    const data = await linkRepo.create({
      user_id: user.id,
      short_code: slug,
      content: body.content,
      is_custom: is_custom,
      meta: {
        title: body.title,
        image: body.image,
      },
    });

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create link",
    };
  }
});
