import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@/database/entities/user.entity';
import { Company } from '@/database/entities/company.entity';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { company_name, company_email, first_name, last_name, email, password } = registerDto;

    // Check if company email already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { email: company_email },
    });

    if (existingCompany) {
      throw new ConflictException('Company email already exists');
    }

    // Check if user email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User email already exists');
    }

    // Create company
    const company = this.companyRepository.create({
      name: company_name,
      email: company_email,
    });
    const savedCompany = await this.companyRepository.save(company);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const user = this.userRepository.create({
      company_id: savedCompany.id,
      first_name,
      last_name,
      email,
      password_hash: passwordHash,
      role: UserRole.ADMIN,
    });
    const savedUser = await this.userRepository.save(user);

    // Generate JWT
    const payload = {
      userId: savedUser.id,
      companyId: savedCompany.id,
      role: savedUser.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
        role: savedUser.role,
        company_id: savedUser.company_id,
      },
      company: {
        id: savedCompany.id,
        name: savedCompany.name,
        email: savedCompany.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with company
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Update last login
    await this.userRepository.update(user.id, { last_login: new Date() });

    // Generate JWT
    const payload = {
      userId: user.id,
      companyId: user.company_id,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        company_id: user.company_id,
      },
      company: {
        id: user.company.id,
        name: user.company.name,
        email: user.company.email,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
