import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HrController } from './controllers/hr.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4000 },
      },
      {
        name: 'HR_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4000 },
      },
    ]),
  ],
  controllers: [AppController, HrController, UserController, AuthController],
  providers: [AppService],
})
export class AppModule {}
