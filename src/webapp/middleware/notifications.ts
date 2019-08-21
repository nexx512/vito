import {RequestHandler} from "express"
import Notifications from "../models/notifications"

export default (): RequestHandler => {

  return (req, res, next) => {
    res.locals.notifications = new Notifications(
      req.flash("error"),
      req.flash("success")
    );

    next();
  }
}
