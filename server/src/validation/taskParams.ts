import { z } from "zod";

export const taskIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID"),
});
