import "dotenv/config";
import cors from "cors";
import express from "express";
import movieRoutes from "./routes/movies.routes.js";
import userRoutes from "./routes/users.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
