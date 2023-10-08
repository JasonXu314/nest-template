import { DynamicModule, Module, Type } from '@nestjs/common';

export const DATA_SOURCE = Symbol('AUTH_DATA_SOURCE'),
	PREFIX = Symbol('AUTH_PREFIX');

export abstract class AuthDataSource {
	public abstract auth(token: string): boolean | Promise<boolean>;
}

export interface AuthModuleOptions {
	prefix: string;
	dataSource: Type<AuthDataSource>;
}

@Module({})
export class AuthModule {
	public static register({ prefix, dataSource }: AuthModuleOptions): DynamicModule {
		return {
			module: AuthModule,
			providers: [
				{ provide: PREFIX, useValue: prefix },
				{ provide: DATA_SOURCE, useClass: dataSource }
			]
		};
	}
}

