import rateLimit, { ipKeyGenerator } from 'express-rate-limit';



export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 30 minutes
    max: 100, 
    message: {
        success: false,
        message: "Too many registration attempts from this IP, please try again after 30 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: {
        success: false,
        message: "Too many login attempts for this email, please try again after 15 minutes."
    },
    keyGenerator: (req, res) => {
        if (req.body && req.body.email) {
            return req.body.email;
        }
        return ipKeyGenerator(req, res); 
    }
});