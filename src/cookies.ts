import {Injectable, OnDestroy, SimpleChange, SimpleChanges} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {CookieOptions} from "./cookie_options";
import {JsonObject} from "./json";

/** Provides access to the [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies). */
@Injectable({providedIn: "root"})
export class Cookies implements Iterable<[string, string|undefined]>, OnDestroy {

	/** The default cookie options. */
	readonly defaults: CookieOptions = new CookieOptions;

	/** The handler of "changes" events. */
	private readonly _onChanges: Subject<SimpleChanges> = new Subject<SimpleChanges>();

	/** The keys of the cookies associated with the current document. */
	get keys(): string[] {
		const keys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, "");
		return keys.length ? keys.split(/\s*(?:=[^;]*)?;\s*/).map(decodeURIComponent) : [];
	}

	/** The number of cookies associated with the current document. */
	get length(): number {
		return this.keys.length;
	}

	/** The stream of "changes" events. */
	get onChanges(): Observable<SimpleChanges> {
		return this._onChanges.asObservable();
	}

	/**
	 * Returns a new iterator that allows iterating the cookies associated with the current document.
	 * @return An iterator for the cookies of the current document.
	 */
	*[Symbol.iterator](): IterableIterator<[string, string|undefined]> {
		for (const key of this.keys) yield [key, this.get(key)];
	}

	/** Removes all cookies associated with the current document. */
	clear(): void {
		const changes: SimpleChanges = {};
		for (const [key, value] of this) {
			changes[key] = new SimpleChange(value, undefined, false);
			this._removeItem(key);
		}

		this._onChanges.next(changes);
	}

	/**
	 * Gets the value associated to the specified key.
	 * @param key The cookie name.
	 * @param defaultValue The value to return if the cookie does not exist.
	 * @return The cookie value, or the default value if the cookie is not found.
	 */
	get(key: string, defaultValue?: string): string|undefined {
		if (!this.has(key)) return defaultValue;

		try {
			const token = encodeURIComponent(key).replace(/[-.+*]/g, String.raw`\$&`);
			const scanner = new RegExp(String.raw`(?:(?:^|.*;)\s*${token}\s*=\s*([^;]*).*$)|^.*$`);
			return decodeURIComponent(document.cookie.replace(scanner, "$1"));
		}

		catch {
			return defaultValue;
		}
	}

	/**
	 * Gets the deserialized value associated to the specified key.
	 * @param key The cookie name.
	 * @param defaultValue The value to return if the cookie does not exist.
	 * @return The deserialized cookie value, or the default value if the cookie is not found.
	 */
	getObject(key: string, defaultValue?: any): any {
		try {
			const value = this.get(key);
			return value != undefined ? JSON.parse(value) : defaultValue;
		}

		catch {
			return defaultValue;
		}
	}

	/**
	 * Gets a value indicating whether the current document has a cookie with the specified key.
	 * @param key The cookie name.
	 * @return `true` if the current document has a cookie with the specified key, otherwise `false`.
	 */
	has(key: string): boolean {
		const token = encodeURIComponent(key).replace(/[-.+*]/g, String.raw`\$&`);
		return new RegExp(String.raw`(?:^|;\s*)${token}\s*=`).test(document.cookie);
	}

	/** Method invoked before the service is destroyed. */
	ngOnDestroy(): void {
		this._onChanges.complete();
	}

	/**
	 * Looks up the cookie with the specified key, or add a new cookie if it isn't there.
	 *
	 * Returns the value associated to `key`, if there is one. Otherwise calls `ifAbsent` to get a new value,
	 * associates `key` to that value, and then returns the new value.
	 *
	 * @param key The key to seek for.
	 * @param ifAbsent The function called to get a new value.
	 * @param options The cookie options.
	 * @return The value associated with the specified key.
	 */
	putIfAbsent(key: string, ifAbsent: () => string, options?: CookieOptions): string {
		if (!this.has(key)) this.set(key, ifAbsent(), options);
		return this.get(key)!;
	}

	/**
	 * Looks up the cookie with the specified key, or add a new cookie if it isn't there.
	 *
	 * Returns the deserialized value associated to `key`, if there is one. Otherwise calls `ifAbsent` to get a new value,
	 * serializes and associates `key` to that value, and then returns the new value.
	 *
	 * @param key The key to seek for.
	 * @param ifAbsent The function called to get a new value.
	 * @param options The cookie options.
	 * @return The deserialized value associated with the specified key.
	 */
	putObjectIfAbsent(key: string, ifAbsent: () => any, options?: CookieOptions): any {
		if (!this.has(key)) this.setObject(key, ifAbsent(), options);
		return this.getObject(key);
	}

	/**
	 * Removes the cookie with the specified key and its associated value.
	 * @param key The cookie name.
	 * @param options The cookie options.
	 * @return The value associated with the specified key before it was removed.
	 */
	remove(key: string, options?: CookieOptions): string|undefined {
		const previousValue = this.get(key);
		this._removeItem(key, options);
		this._onChanges.next({
			[key]: new SimpleChange(previousValue, undefined, false)
		});

		return previousValue;
	}

	/**
	 * Associates a given value to the specified key.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @return This instance.
	 * @throws `TypeError` The specified key is invalid.
	 */
	set(key: string, value: string, options?: CookieOptions): this {
		if (!key.length) throw new TypeError("Invalid cookie name.");

		const cookieOptions = this._getOptions(options).toString();
		let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		if (cookieOptions.length) cookieValue += `; ${cookieOptions}`;

		const previousValue = this.get(key);
		document.cookie = cookieValue;
		this._onChanges.next({
			[key]: new SimpleChange(previousValue, value, false)
		});

		return this;
	}

	/**
	 * Serializes and associates a given value to the specified key.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @return This instance.
	 */
	setObject(key: string, value: any, options?: CookieOptions): this {
		return this.set(key, JSON.stringify(value), options);
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @return The map in JSON format corresponding to this object.
	 */
	toJSON(): JsonObject {
		const map: JsonObject = {};
		for (const [key, value] of this) map[key] = value ?? null;
		return map;
	}

	/**
	 * Returns a string representation of this object.
	 * @return The string representation of this object.
	 */
	toString(): string {
		return document.cookie;
	}

	/**
	 * Merges the default cookie options with the specified ones.
	 * @param options The options to merge with the defaults.
	 * @return The resulting cookie options.
	 */
	private _getOptions(options: CookieOptions = new CookieOptions): CookieOptions {
		return new CookieOptions({
			domain: options.domain.length ? options.domain : this.defaults.domain,
			expires: options.expires ? options.expires : this.defaults.expires,
			path: options.path.length ? options.path : this.defaults.path,
			secure: options.secure ? options.secure : this.defaults.secure
		});
	}

	/**
	 * Removes the value associated to the specified key.
	 * @param key The cookie name.
	 * @param options The cookie options.
	 */
	private _removeItem(key: string, options?: CookieOptions): void {
		if (!this.has(key)) return;
		const cookieOptions = this._getOptions(options);
		cookieOptions.expires = new Date(0);
		document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
	}
}
