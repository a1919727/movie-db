import "dotenv/config";
import cors from "cors";
import express from "express";
import movieRoutes from "./routes/movies.routes.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
