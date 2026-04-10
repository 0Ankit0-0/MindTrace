export const env = {
  jwtSecret: process.env.JWT_SECRET || "mindtrace-demo-secret",
  port: Number(process.env.PORT || 4000),
  saltRounds: Number(process.env.SALT_ROUNDS || 10),
};
