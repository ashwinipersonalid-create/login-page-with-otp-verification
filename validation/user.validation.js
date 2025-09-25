import Joi from "joi";
import { mobile } from "./custom.validation.js";

export const createUser = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    role: Joi.string().required().valid("student", "operator"),
    mobile: Joi.string().required().custom(mobile),
    location: Joi.string().required(),
    gender: Joi.string().required().valid("male", "female", "other"),
  }),
};

export const getUsers = {
  query: Joi.object({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};

export const updateUser = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
  body: Joi.object({
    email: Joi.string().email(),
    name: Joi.string(),
    role: Joi.string().valid("student", "operator"),
    mobile: Joi.string().custom(mobile),
    location: Joi.string(),
    updatedAt: Joi.date(),
    gender: Joi.string().valid("male", "female", "other"),
  }).min(1),
};

export const deleteUser = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};
