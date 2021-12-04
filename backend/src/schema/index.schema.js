import userSchema from "./user.schema.js";
import projectSchema from "./project.schema.js";
import enrollmentSchema from "./enrollments.schema.js";
import miscSchema from "./misc.schema.js";

export default [
  ...userSchema,
  ...projectSchema,
  ...enrollmentSchema,
  ...miscSchema,
]