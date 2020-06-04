# Iteration
The [`Cookies`](api.md) class is iterable: you can go through all key/value pairs contained using a `for...of` loop.
Each entry is an array with two elements (i.e. the key and the value):

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
		this._cookies.set("foo", "bar");
		this._cookies.set("anotherKey", "anotherValue");

		for (const entry of this._cookies) {
			console.log(entry);
			// Round 1: ["foo", "bar"]
			// Round 2: ["anotherKey", "anotherValue"]
		}
	}
}
```
