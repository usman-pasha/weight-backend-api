import eventBus from "../core/eventEmitter.js";
import { EVENTS } from "../core/events.js";
import logger from "../utils/log.js";

eventBus.on(EVENTS.USER_REGISTER, async (payload) => {
    try {
        logger.info(`EVENT: USER_REGISTER for user email ${payload.email}`);
        // ✅ Fetch driver ONCE
    } catch (error) {
        logger.error("USER_REGISTER failed", error);
    }
});
