import { createHmac, createHash } from 'crypto';

interface SignatureOptions {
	method: string;
	url: string;
	headers: Record<string, string>;
	body?: Buffer | string;
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	service: string;
}

export class AwsSignatureV4 {
	private static readonly algorithm = 'AWS4-HMAC-SHA256';
	private static readonly signedHeaders = ['host', 'x-amz-content-sha256', 'x-amz-date'];

	static sign(options: SignatureOptions): Record<string, string> {
		const { method, url, headers, body, accessKeyId, secretAccessKey, region, service } = options;

		const urlObj = new URL(url);
		const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
		const dateStamp = timestamp.substring(0, 8);

		// Calculate body hash
		const bodyHash = this.hash(body || '');

		// Update headers
		const signHeaders: Record<string, string> = {
			...headers,
			host: urlObj.hostname,
			'x-amz-date': timestamp,
			'x-amz-content-sha256': bodyHash,
		};

		// Create canonical request
		const canonicalRequest = this.createCanonicalRequest(method, urlObj, signHeaders, bodyHash);

		// Create string to sign
		const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
		const stringToSign = [
			this.algorithm,
			timestamp,
			credentialScope,
			this.hash(canonicalRequest),
		].join('\n');

		// Calculate signature
		const signingKey = this.getSigningKey(secretAccessKey, dateStamp, region, service);
		const signature = this.hmac(signingKey, stringToSign, 'hex');

		// Create authorization header
		const authorizationHeader = [
			`${this.algorithm} Credential=${accessKeyId}/${credentialScope}`,
			`SignedHeaders=${this.signedHeaders.join(';')}`,
			`Signature=${signature}`,
		].join(', ');

		signHeaders['Authorization'] = authorizationHeader;

		return signHeaders;
	}

	static signUrl(options: SignatureOptions & { expiresIn: number }): string {
		const { method, url, accessKeyId, secretAccessKey, region, service, expiresIn } = options;

		const urlObj = new URL(url);
		const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
		const dateStamp = timestamp.substring(0, 8);
		const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

		// Add query parameters
		urlObj.searchParams.set('X-Amz-Algorithm', this.algorithm);
		urlObj.searchParams.set('X-Amz-Credential', `${accessKeyId}/${credentialScope}`);
		urlObj.searchParams.set('X-Amz-Date', timestamp);
		urlObj.searchParams.set('X-Amz-Expires', expiresIn.toString());
		urlObj.searchParams.set('X-Amz-SignedHeaders', 'host');

		// Create canonical request for presigned URL
		const canonicalRequest = [
			method,
			urlObj.pathname,
			urlObj.searchParams.toString(),
			`host:${urlObj.hostname}\n`,
			'host',
			'UNSIGNED-PAYLOAD',
		].join('\n');

		// Create string to sign
		const stringToSign = [
			this.algorithm,
			timestamp,
			credentialScope,
			this.hash(canonicalRequest),
		].join('\n');

		// Calculate signature
		const signingKey = this.getSigningKey(secretAccessKey, dateStamp, region, service);
		const signature = this.hmac(signingKey, stringToSign, 'hex');

		// Add signature to URL
		urlObj.searchParams.set('X-Amz-Signature', signature);

		return urlObj.toString();
	}

	private static createCanonicalRequest(
		method: string,
		urlObj: URL,
		headers: Record<string, string>,
		bodyHash: string,
	): string {
		// Sort headers by key
		const sortedHeaders = Object.keys(headers)
			.filter((key) => this.signedHeaders.includes(key.toLowerCase()))
			.sort()
			.map((key) => `${key.toLowerCase()}:${headers[key].trim()}`)
			.join('\n');

		const canonicalRequest = [
			method,
			urlObj.pathname || '/',
			urlObj.searchParams.toString(),
			sortedHeaders + '\n',
			this.signedHeaders.join(';'),
			bodyHash,
		].join('\n');

		return canonicalRequest;
	}

	private static getSigningKey(
		secretAccessKey: string,
		dateStamp: string,
		region: string,
		service: string,
	): Buffer {
		const kDate = this.hmac(`AWS4${secretAccessKey}`, dateStamp);
		const kRegion = this.hmac(kDate, region);
		const kService = this.hmac(kRegion, service);
		const kSigning = this.hmac(kService, 'aws4_request');
		return kSigning;
	}

	private static hash(data: Buffer | string): string {
		return createHash('sha256').update(data).digest('hex');
	}

	private static hmac(key: Buffer | string, data: string, encoding?: 'hex'): any {
		const hmac = createHmac('sha256', key).update(data);
		return encoding ? hmac.digest(encoding) : hmac.digest();
	}
}