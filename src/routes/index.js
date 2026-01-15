import encryRouter from "./encry.route.js";

const routes = (app) => {
    app.use("/encry", encryRouter)
}

export default routes;