const errorHandler = (req, res, next) => {
  const {rule, data} = req.body

  const fail = (res, rule, data) => {
    return res.status(400).json({
        message: `field ${rule.field} failed validation.`,
        status: "error",
        data: {
        validation: {
            error: true,
            field: rule.field,
            field_value: data[rule.field],
            condition: rule.condition,
            condition_value: rule.condition_value,
        },
        },
    });
    };
    
  const missing = (res, rule, data) => {
    return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
    });
  };

  if (!rule) {
    return res.status(400).json({
      message: "rule is required.",
      status: "error",
      data: null,
    });
  }

  if (!data) {
    return res.status(400).json({
      message: "data is required.",
      status: "error",
      data: null,
    });
  }

  if (typeof rule !== "object") {
    return res.status(400).json({
      message: `rule should be an object.`,
      status: "error",
      data: null,
    });
  }

  if (typeof rule !== "object" && typeof data !== "object") {
    return res.status(400).json({
      message: `"Invalid JSON payload passed.`,
      status: "error",
      data: null,
    });
  }

  if (rule && rule.condition === "eq" && rule.field.includes(".")) {
      let arr = rule.field.split(".");
  
      if (!data[arr[0]].hasOwnProperty(arr[1])) {
        missing(res, rule, data);
      } else if (data[arr[0]][arr[1]] !== rule.condition_value) {
        fail(res, rule, data);
      } else {
        return next();
      }
    }
  
  if (rule && rule.condition === "gt" && rule.field.includes(".")) {
      let arr = rule.field.split(".");
  
      if (!data[arr[0]].hasOwnProperty(arr[1])) {
        missing(res, rule, data);
      } else if (data[arr[0]][arr[1]] > rule.condition_value) {
        return next();
      } else {
        fail(res, rule, data);
      }
    }
  
  if (rule && rule.condition === "gte" && rule.field.includes(".")) {
      let arr = rule.field.split(".");
  
      if (!data[arr[0]].hasOwnProperty(arr[1])) {
        missing(res, rule, data);
      } else if (
        data[arr[0]][arr[1]] > rule.condition_value ||
        data[arr[0]][arr[1]] === rule.condition_value
      ) {
        return next();
      } else {
        fail(res, rule, data);
      }
    }
  
  if (rule && rule.condition === "neq" && rule.field.includes(".")) {
      let arr = rule.field.split(".");
  
      if (!data[arr[0]].hasOwnProperty(arr[1])) {
        missing(res, rule, data);
      } else if (data[arr[0]][arr[1]] !== rule.condition_value) {
        return next();
      } else {
        fail(res, rule, data);
      }
    }
  
    if (typeof data === "object" && !data.hasOwnProperty(rule.field)) {
      missing(res, rule, data);
    }
  
    if (typeof data === "object" && typeof rule.condition_value !== typeof data[rule.field]) {
      return res.status(400).json({
        message: `${
          data[rule.field]
        } should be a|an ${typeof rule.condition_value}.`,
        status: "error",
        data: null,
      });
    }
  
    if (typeof data === "string" && rule.condition === "eq" && rule.condition_value !== data) {
      fail(res, rule, data);
    } else if (typeof data === "object" && rule.condition === "eq" && rule.condition_value !== data[rule.field]
    ) {
      fail(res, rule, data);
    }
  
    if (rule && rule.condition === "gte") {
      if (data[rule.field] > rule.condition_value || data[rule.field] === rule.condition_value) {
        return next();
      }
      fail(res, rule, data);
    }
  
    if (rule && rule.condition === "gt") {
      if (data[rule.field] > rule.condition_value) {
        return next();
      }
      fail(res, rule, data);
    }
  
    if (rule && rule.condition === "neq") {
      if (data[rule.field] !== rule.condition_value) {
        return next();
      }
      fail(res, rule, data);
    }
  
    if (
      (rule && rule.condition === "contains" && Array.isArray(data)) ||
      typeof data === "string"
    ) {
      if (typeof data === "string" &&!data.toLowerCase().includes(rule.field.toLowerCase())) {
        missing(res, rule, data);
      }
      if (Array.isArray(data) && !data.includes(rule.condition_value, rule.field)) {
        missing(res, rule, data);
      }
    }
  
    next();
}
module.exports = errorHandler