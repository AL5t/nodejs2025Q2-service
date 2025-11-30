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
    return this.users.map(({ password, ...otherParams }) => otherParams);
  }

  getUserById(id: string): Omit<User, 'password'> {
    this.validateUUID(id);
    const foundUser = this.users.find((user) => user.id === id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPas } = foundUser;
    return userWithoutPas;
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
    const { password, ...newUserWithoutPas } = newUser;
    return newUserWithoutPas;
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

    const { password, ...updatedUserWithoutPas } = foundUser;
    return updatedUserWithoutPas;
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
