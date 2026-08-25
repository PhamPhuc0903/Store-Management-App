import {LoggerModule} from "nestjs-pino";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {HealthModule} from "./health/health.module";
import {validateEnvironment} from "./config/validate-environment";



@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: validateEnvironment
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers["set-cookie"]',
          ],
          censor: '[REDACTED]'
        },
      },
    }),
    HealthModule,
  ],
})

export class AppModule {}
