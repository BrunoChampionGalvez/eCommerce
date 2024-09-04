import { NextFunction, Request, Response } from "express";

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
    const requestDate = new Date()
    console.log(`Se ejecutó el loggerGlobal middleware con el método ${req.method} en la ruta ${req.url} en la fecha y hora ${requestDate}.`);
    next()
}