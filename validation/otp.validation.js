import Joi from "joi";

export const sendOtpValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const verifyOtpValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  }),
};
