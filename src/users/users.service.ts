import { v4, validate } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './dto/users.dto';
import { User } from './userInterface';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  private users: User[] = [];

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid user id (not UUID)');
    }
  }

  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ id, login, version, createdAt, updatedAt }) => ({
      id,
      login,
      version,
      createdAt,
      updatedAt,
    }));
  }

  getUserById(id: string): Omit<User, 'password'> {
    this.validateUUID(id);
    const foundUser = this.users.find((user) => user.id === id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return {
      id: foundUser.id,
      login: foundUser.login,
      version: foundUser.version,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };
  }

  createUser(dto: CreateUserDto): Omit<User, 'password'> {
    if (
      !dto.login ||
      !dto.password ||
      typeof dto.login !== 'string' ||
      typeof dto.password !== 'string'
    ) {
      throw new BadRequestException('Required login or password missing');
    }

    const dateNow = Date.now();

    const newUser = {
      id: v4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
    };

    this.users.push(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  updateUser(id: string, dto: UpdatePasswordDto): Omit<User, 'password'> {
    this.validateUUID(id);

    const foundUser = this.users.find((user) => user.id === id);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password does not match');
    }

    foundUser.password = dto.newPassword;
    foundUser.version++;
    foundUser.updatedAt = Date.now();

    return {
      id: foundUser.id,
      login: foundUser.login,
      version: foundUser.version,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };
  }

  deleteUser(id: string) {
    this.validateUUID(id);

    const deletedUserIndex = this.users.findIndex((user) => user.id === id);
    if (deletedUserIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(deletedUserIndex, 1);
  }
}
