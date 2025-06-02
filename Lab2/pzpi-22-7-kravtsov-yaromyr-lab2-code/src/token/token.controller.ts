import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }

    @Get('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken, deviceId } = req.cookies;
            const userData = await this.tokenService.refresh(refreshToken, deviceId, {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            });

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.cookie('deviceId', userData.deviceId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    }
}
