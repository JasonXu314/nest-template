import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Redirect } from 'src/utils/filters/redirect.filter';
import { AuthDataSource, DATA_SOURCE, PREFIX } from './auth.module';

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(@Inject(DATA_SOURCE) private readonly source: AuthDataSource, @Inject(PREFIX) private readonly prefix: string) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const token = req.cookies[`${this.prefix}::token`];

		if (token === undefined) {
			throw new Redirect('/login');
		}

		return this.source.auth(token);
	}
}

