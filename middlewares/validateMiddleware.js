export const validate = (schema) => (req, res, next) => {
  try {
    let data;
    if (schema.body) data = schema.body.validate(req.body);
    else if (schema.params) data = schema.params.validate(req.params);
    else if (schema.query) data = schema.query.validate(req.query);

    if (data.error) {
      return res.status(400).json({ success: false, message: data.error.details[0].message });
    }
    next();
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({ success: false, message: "Validation error" });
  }
};


