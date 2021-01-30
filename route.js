const express = require("express");
const router = express.Router();
const errorHandler = require("./middleware/error")

router.get("/",  async (req, res, next) => {
    try {
      const info = {
        name: "Oluwaseun Ojo",
        github: "@Ojooluwaseun",
        email: "oluwaseun.ojo2404@gmail.com",
        mobile: "08164047191",
        twitter: "@itsoluwaseun_"
      }
      
      res.status(200).json({ message: "My Rule-Validation API.", status:"success", data: info });
    } catch (err) {
      next(err);
    }
  });

  router.post("/validate-rule", errorHandler, (req, res, next) => {
    const { data, rule } = req.body;
    try {
        res.status(200).json({
            message: `field ${rule.field} successfully validated.`,
            status: "success",
            data: {
                validation: {
                    error: false,
                    field: rule.field,
                    field_value: data[rule.field],
                    condition: rule.condition,
                    condition_value: rule.condition_value
                }
            }
        });
    } catch (err) {
        next(err)
    }

  })


module.exports = router