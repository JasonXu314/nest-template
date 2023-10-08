import { DynamicModule, Module } from '@nestjs/common';

export const AUTH_DATA_SOURCE = Symbol('AUTH_DATA_SOURCE'),
	PREFIX = Symbol('AUTH_PREFIX');

export abstract class AuthDataSource {
	public abstract auth(token: string): boolean | Promise<boolean>;
}

export interface AuthModuleOptions {
	prefix: string;
}

@Module({})
export class AuthModule {
	public static register({ prefix }: AuthModuleOptions): DynamicModule {
		return {
			module: AuthModule,
			providers: [{ provide: PREFIX, useValue: prefix }]
		};
	}
}

