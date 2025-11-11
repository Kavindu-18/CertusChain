import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@/database/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(companyId: string, currentUserRole: UserRole, createUserDto: CreateUserDto) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create users');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      company_id: companyId,
      password_hash: passwordHash,
    });

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password_hash;
    return savedUser;
  }

  async findAll(companyId: string) {
    const users = await this.userRepository.find({
      where: { company_id: companyId },
      order: { created_at: 'DESC' },
    });
    return users.map((user) => {
      delete user.password_hash;
      return user;
    });
  }

  async findOne(companyId: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password_hash;
    return user;
  }

  async update(companyId: string, currentUserRole: UserRole, id: string, updateUserDto: UpdateUserDto) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update users');
    }

    const user = await this.userRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto['password_hash'] = await bcrypt.hash(updateUserDto.password, 10);
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(user);
    delete savedUser.password_hash;
    return savedUser;
  }

  async remove(companyId: string, currentUserRole: UserRole, id: string) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.userRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
