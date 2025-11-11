import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '@/database/entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = request;

    // Only log mutations (POST, PUT, PATCH, DELETE)
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    // Skip auth endpoints
    if (url.includes('/auth/')) {
      return next.handle();
    }

    // Skip if no user (shouldn't happen with AuthGuard)
    if (!user) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((response) => {
        this.logAction({
          user_id: user.userId,
          company_id: user.companyId,
          action_type: this.getActionType(method, url),
          target_resource_id: this.extractResourceId(response),
          target_resource_type: this.extractResourceType(url),
          after_value: this.sanitizeData(response),
          ip_address: ip,
        });
      }),
    );
  }

  private async logAction(data: Partial<AuditLog>) {
    try {
      const log = this.auditLogRepository.create(data);
      await this.auditLogRepository.save(log);
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  }

  private getActionType(method: string, url: string): string {
    const resource = this.extractResourceType(url);
    const actionMap = {
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };
    return `${actionMap[method]}_${resource}`.toUpperCase();
  }

  private extractResourceType(url: string): string {
    const segments = url.split('/').filter(Boolean);
    return segments[0] || 'UNKNOWN';
  }

  private extractResourceId(response: any): string | null {
    if (response && typeof response === 'object') {
      return response.id || null;
    }
    return null;
  }

  private sanitizeData(data: any): any {
    if (!data) return null;
    
    // Remove sensitive fields
    const sanitized = { ...data };
    delete sanitized.password;
    delete sanitized.password_hash;
    delete sanitized.token;
    
    return sanitized;
  }
}
