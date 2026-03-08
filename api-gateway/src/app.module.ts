import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HrController } from './controllers/hr.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      // {
      //   name: 'USER_SERVICE',
      //   transport: Transport.TCP,
      //   options: { host: 'localhost', port: 4001 },
      // },
      {
        name: 'HR_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4000 },
      },
    ]),
  ],
  controllers: [AppController, HrController],
  providers: [AppService],
})
export class AppModule {}
