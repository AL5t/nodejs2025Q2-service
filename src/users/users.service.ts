import { validate } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './dto/users.dto';
import { User } from './user.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid user id (not UUID)');
    }
  }

  async getAllUsers() {
    const users = await this.usersRepo.find();
    return users.map(({ id, login, version, createdAt, updatedAt }) => ({
      id,
      login,
      version,
      createdAt,
      updatedAt,
    }));
  }

  async getUserById(id: string) {
    this.validateUUID(id);
    const foundUser = await this.usersRepo.findOne({
      where: { id },
      relations: [],
    });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return {
      id: foundUser.id,
      login: foundUser.login,
      version: foundUser.version,
      createdAt: Number(foundUser.createdAt),
      updatedAt: Number(foundUser.updatedAt),
    };
  }

  async getUserByLogin(login: string) {
    const foundUser = await this.usersRepo.findOne({
      where: { login },
    });
    if (!foundUser) {
      return null;
    }

    return {
      id: foundUser.id,
      login: foundUser.login,
      password: foundUser.password,
      version: foundUser.version,
      createdAt: Number(foundUser.createdAt),
      updatedAt: Number(foundUser.updatedAt),
    };
  }

  async createUser(dto: CreateUserDto) {
    if (
      !dto.login ||
      !dto.password ||
      typeof dto.login !== 'string' ||
      typeof dto.password !== 'string'
    ) {
      throw new BadRequestException('Required login or password missing');
    }

    const newUser = this.usersRepo.create({
      login: dto.login,
      password: dto.password,
    });

    try {
      await this.usersRepo.save(newUser);
    } catch (e) {
      if (e.code === '23505') {
        throw new BadRequestException('Login already existss');
      }
      throw e;
    }

    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: Number(newUser.createdAt),
      updatedAt: Number(newUser.updatedAt),
    };
  }

  async updateUser(id: string, dto: UpdatePasswordDto) {
    this.validateUUID(id);

    const foundUser = await this.usersRepo.findOneBy({ id });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password does not match');
    }

    foundUser.password = dto.newPassword;
    await this.usersRepo.save(foundUser);

    return {
      id: foundUser.id,
      login: foundUser.login,
      version: foundUser.version,
      createdAt: Number(foundUser.createdAt),
      updatedAt: Number(foundUser.updatedAt),
    };
  }

  async deleteUser(id: string) {
    this.validateUUID(id);

    const deletedUser = this.usersRepo.delete(id);
    if ((await deletedUser).affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
