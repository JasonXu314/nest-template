import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { $if, page } from '../html';

export class ErrorPage {
	public constructor(public readonly message: string, public readonly links: Record<string, string>, public readonly jsonDump: any = null) {}
}

@Catch()
export class ErrorPageFilter extends BaseExceptionFilter {
	public catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception instanceof HttpException) {
			const err = exception.getResponse();

			if (err instanceof ErrorPage) {
				response.status(exception.getStatus()).setHeader('Content-Type', 'text/html').send(page('[placeholder] - Oops!')`
					<h1>An error occured:</h1>
					<p class="error">${err.message}</p>
					${$if(err.jsonDump !== null)`
					<h2>JSON Dump:</h2>
					<code>${JSON.stringify(err.jsonDump, null, 4)}</code>
					<br>`}
					<div class="row">
						${Object.entries(err.links)
							.map(([label, href]) => `<a href="${href}" role="button">${label}</a>`)
							.join('')}
					</div>
				`);

				return;
			}
		}

		super.catch(exception, host);
	}
}

