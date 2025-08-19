import { Request, Response, NextFunction } from 'express';
declare class KmlController {
    static generateAll(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default KmlController;
