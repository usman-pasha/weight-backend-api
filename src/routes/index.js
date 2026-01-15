import encryRouter from "./encry.route.js";
import authRouter from "./auth.route.js";

const routes = (app) => {
    app.use("/auth", authRouter);
    app.use("/encry", encryRouter);
}

export default routes;