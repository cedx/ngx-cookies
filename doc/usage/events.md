# Events
Every time one or several values are changed (added, removed or updated) through the `Cookies` class, a `changes` event is triggered.

This event is exposed as an [Observable](https://angular.io/guide/observables), you can subscribe to it using the `onChanges` property:

``` typescript
import {Component, OnInit} from "@angular/core";
import {Cookies} from "@cedx/ngx-cookies";

@Component({
	selector: "my-component",
	templateUrl: "./my-component.html"
})
export class MyComponent implements OnInit {
	constructor(private _cookies: Cookies) {}
	
	ngOnInit(): void {
		this._cookies.onChanges.subscribe(changes => {
			for (const [key, value] of Object.entries(changes)) console.log(`${key}: ${value}`);
		});
	}
}
```

The changes are expressed as a [`SimpleChanges`](https://angular.io/api/core/SimpleChanges) object.
The values of this object are [`SimpleChange`](https://angular.io/api/core/SimpleChange) instances, where an `undefined` property indicates an absence of value:

``` typescript
import {Component, OnInit} from "@angular/core";
import {Cookies} from "@cedx/ngx-cookies";

@Component({
	selector: "my-component",
	templateUrl: "./my-component.html"
})
export class MyComponent implements OnInit {
	constructor(private _cookies: Cookies) {}
	
	ngOnInit(): void {
		this._cookies.onChanges.subscribe(changes => {
			for (const [key, change] of Object.entries(changes)) console.log({
				key,
				current: change.currentValue,
				previous: change.previousValue
			});
		});

		this._cookies.set("foo", "bar");
		// Prints: {key: "foo", current: "bar", previous: undefined}

		this._cookies.set("foo", "baz");
		// Prints: {key: "foo", current: "baz", previous: "bar"}

		this._cookies.remove("foo");
		// Prints: {key: "foo", current: undefined, previous: "baz"}
	}
}
```

The values contained in the `currentValue` and `previousValue` properties of the [`SimpleChange`](https://angular.io/api/core/SimpleChange) instances are the raw cookie values. If you use the `Cookies.setObject()` method to set a cookie, you will get the serialized string value, not the original value passed to the method:

``` typescript
import {Component, OnInit} from "@angular/core";
import {Cookies} from "@cedx/ngx-cookies";

@Component({
	selector: "my-component",
	templateUrl: "./my-component.html"
})
export class MyComponent implements OnInit {
	constructor(private _cookies: Cookies) {}
	
	ngOnInit(): void {
		this._cookies.setObject("foo", {bar: "baz"});
		// Prints: {key: "foo", current: "{\"bar\": \"baz\"}", previous: undefined}
	}
}
```
