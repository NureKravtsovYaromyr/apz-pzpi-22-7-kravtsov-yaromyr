import { Module, Global } from '@nestjs/common';
import { MyLogger } from './logger.service';

@Global() // Делает LoggerModule доступным во всем приложении
@Module({
  providers: [MyLogger], // Регистрируем CustomLogger как провайдер
  exports: [MyLogger], // Экспортируем, чтобы другие модули могли его использовать
})
export class LoggerModule {}
