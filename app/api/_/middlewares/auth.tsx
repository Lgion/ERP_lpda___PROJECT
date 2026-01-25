import jwt from 'jsonwebtoken';

export default (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken: any = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};