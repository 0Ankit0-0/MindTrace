import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import onboardingRoutes from "./routes/onboarding.routes";
import aiRoutes from "./routes/ai.routes";
import checkinRoutes from "./routes/checkin.routes";
import analyzeRoutes from "./routes/analyze.routes";
import studyPlanRoutes from "./routes/study-plan.routes";
import sessionRoutes from "./routes/session.routes";
import gamificationRoutes from "./routes/gamification.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import db from "./database/sqlite/db";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);
app.use(requestLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      database: db.open ? "connected" : "unknown",
    },
  });
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/onboarding", onboardingRoutes);
app.use("/ai", aiRoutes);
app.use("/checkin", checkinRoutes);
app.use("/analyze", analyzeRoutes);
app.use("/analyze-session", sessionRoutes);
app.use("/study-plan", studyPlanRoutes);
app.use("/gamification", gamificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
