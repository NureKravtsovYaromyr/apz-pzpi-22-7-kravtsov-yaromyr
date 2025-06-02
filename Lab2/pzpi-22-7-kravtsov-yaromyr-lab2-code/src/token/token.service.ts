import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';
import { SaveTokenDto } from './dto/save-token.dto';
import { PayloadDto } from './dto/payload.dto';
import { UserService } from 'src/user/user.service';
import { Op } from 'sequelize';

import { JwtPayload, sign, verify } from 'jsonwebtoken';
import * as crypto from 'crypto';
@Injectable()
export class TokenService {
    constructor(@InjectModel(Token) private tokenRepository: typeof Token,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService) { }

    generateTokens(payload: PayloadDto): { accessToken: string; refreshToken: string } {
        try {
            const accessToken = sign({ ...payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' });
            const refreshToken = sign({ ...payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
            return { accessToken, refreshToken }
        } catch (error) {
            throw error;
        }
    }

    async deleteUserTokens(userId: number) {
        try {
            await this.tokenRepository.destroy({
                where: {
                    userId: userId
                }
            })
        } catch (error) {
            throw error;
        }
    }

    async saveToken(dto: SaveTokenDto & { ip?: string; userAgent?: string }): Promise<Token> {
        try {
            const tokenData = await this.tokenRepository.findOne({
                where: { userId: dto.userId, deviceId: dto.deviceId },
            });

            if (tokenData) {
                tokenData.refreshToken = dto.refreshToken;
                tokenData.ip = dto.ip;
                tokenData.userAgent = dto.userAgent;
                return await tokenData.save();
            } else {
                return await this.tokenRepository.create({ ...dto });
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }


    async removeToken(refreshToken: string): Promise<number> {
        const tokenData = await this.tokenRepository.destroy({ where: { refreshToken } });
        return tokenData;
    }

    async removeAllTokensForUser(userId: number) {
        await this.tokenRepository.destroy({
            where: {
                userId: userId,
            },
        });

    }

    validateAccessToken(token: string): JwtPayload {
        return verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
    }


    validateRefreshToken(token) {
        try {
            const userData = verify(token, process.env.JWT_REFRESH_SECRET) as JwtPayload;
            return userData;
        } catch (e) {
            throw e;
        }
    }

    async refresh(refreshToken: string, deviceId: string, meta?: { ip?: string; userAgent?: string }) {
        if (!refreshToken || !deviceId) {
            throw new UnauthorizedException('Missing token or deviceId');
        }

        const userData = this.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.findToken(refreshToken, deviceId);

        if (!userData || !tokenFromDb) {
            throw new UnauthorizedException('Invalid token or device');
        }

        const user = await this.userService.findByPk(userData.userId);

        const payload: PayloadDto = {
            userId: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        const accessToken = this.generateTokens(payload).accessToken;

        // 🔥 НЕ оновлюємо refreshToken, просто повертаємо access
        return {
            accessToken,
            refreshToken, // залишаємо старий
            deviceId,
        };
    }



    generateDeviceId(): string {
        return crypto.randomBytes(Math.ceil(20 / 2))
            .toString('hex')
            .slice(0, 20);
    }

    async findToken(refreshToken: string, deviceId: string) {
        return await this.tokenRepository.findOne({
            where: { refreshToken, deviceId },
        });
    }

}
