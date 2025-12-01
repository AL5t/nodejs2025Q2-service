import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
