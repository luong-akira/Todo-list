import { Request, Response, NextFunction } from "express";

export const role = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (roles.includes(req.user.role)) {
        console.log("User can access this route");
        next();
      } else {
        throw new Error(
          `User with role ${req.user.role} can not access this route`
        );
      }
    } catch (error: Error | any) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  };
};
