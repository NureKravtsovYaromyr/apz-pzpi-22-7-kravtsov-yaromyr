import { HttpException, Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as moment from 'moment-timezone';

@Injectable()
export class MyLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', // Уровень логирования (error, warn, info, http, verbose, debug, silly)
      format: winston.format.combine(
        winston.format.timestamp({
          format: () =>
            moment().tz('Europe/Berlin').format('YYYY-MM-DD HH:mm:ss'), // Форматирование времени в Берлинском часовом поясе
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),

      transports: [
        new winston.transports.Console(), // Логирование в консоль
        new winston.transports.DailyRotateFile({
          dirname: 'logs', // Директория для логов
          filename: '%DATE%-app.log', // Шаблон имени файла
          datePattern: 'YYYY-MM-DD', // Шаблон даты в имени файла
          zippedArchive: true, // Архивировать старые логи
          maxSize: '20m', // Максимальный размер файла
          maxFiles: '14d', // Хранить файлы не дольше 14 дней
        }),
      ],
    });
  }

  log(message: string, dto?: any) {
    this.logger.info(
      message + (dto ? `\nDTO:\n${JSON.stringify(dto, null, 2)}` : '')
    );
  }


  error(message: string, e: any) {
    const error = new HttpException(
      e.message,
      e.status
    );
    this.logger.error(
      message + (error ? `\n${JSON.stringify(error, null, 2)}` : '')
    );
  }

  warn(message: string) {
    this.logger.warn(message);
  }

}
