# mu-forms

> Dead simple form library for React/Preact.

![mu-forms logo](https://cdn.rawgit.com/mobiushorizons/mu-forms/master/mu-forms.svg)

## Rationale

Mu-forms stores form data in the state of a wrapper `Component` [(`<Form>`)](#form) instead of a 
`Redux store`. By doing so, it keeps invalid / incomplete user-submitted data out of your `store`. 
Leaving it cleaner and easier to reason about. At the same time it allows you to connect to the 
data of the parent `<Form>` by creating connected components using [connectForm](#connectform).

Mu-forms additionally provides validation, synchronous and asynchronous submission, as well as the 
ability to preload the form with data.

## Installing

`mu-forms` can be installed from npm:

    npm install mu-forms --save

or using `Yarn`:

    yarn add mu-forms

## Importing

To include it in a `Preact` project, import from `mu-forms/preact` like so:

    import { Form, connectForm } from 'mu-forms/preact'

Similarly to use it for `React` based projects, import from `mu-forms/react`

    import { Form, connectForm } from 'mu-forms/react'

## Examples

 Check the [examples](https://mobiushorizons.github.com/mu-forms) to see working code in both 
 `React` and `Preact`.

### Building a Form

Creating a form is as simple as adding connected inputs and giving them a `name` prop.
In the following example, `TextInput` is a wrapper arround an input, and `Errors` just displays 
any errors we might have.

```jsx
<Form onSubmit={submit} onSubmitted={done}>
	<Errors /> 
	<h1> Example Registration Form </h1>

	<TextInput
		label="Email"
		name="email"
		type="email"
		required
	/>

	<TextInput
		label="Password"
		name="password"
		type="password"
		minLength={8}
		invalidText="Please enter at least 8 characters"
		required
	/>

	<TextInput
		label="Confirm Password"
		name="password2"
		type="password"
		validate={(val, form) => val == form.password }
		invalidText="Passwords must match"
		required
	/>
	<button type="submit"> 
		<span>Register</span>
		<span className="loading" />
	</button>
</Form>
```

The `submit` function shown above can return a Promise in order to put the form into a `submitting` state.

```javascript
function submit(data) {
	// return a promise to show the loading state of the form.
	return new Promise((resolve,reject) => {
		setTimeout(() => {
			if (data.email == 'error@example.com') {
				// this will set `status.error` to true, and display the error
				reject('Oops Something went wrong...');
			} else {
				// this will call our `onSubmitted` function.
				resolve();
			}
		}, 2400);
	});
}
```

The done function will only be fired if the submit was successful. Normally you would use this for 
closing a modal, or navigation, but we will just use an alert to show that it has completed.

```javascript
function done(result) {
	alert('Form successfully submitted');
}
```

### connectForm

To make the above example actually work, we need to create components that can be connected into the form.
We will start with a text input wrapper.

```jsx
/** 
 * This component wraps a standard `input` with a label, and some optional invalid text 
 * invalid text is shown/hidden using css, but you could use `invalid` and `status.invalid` instead
 */
const _TextInput = ({ invalid, invalidText, onChange, validate, label, status, ...props}) => (
	<label className="text-input" invalid={invalid ? '' : null}>
		<span className="text-input__label">{label}</span>
		<input onInput={onChange} {...props}/>
		<span className="text-input__invalid_text">{invalidText}</span>
	</label>
);
const TextInput = connectForm(_TextInput);
```

```jsx
/* This component displays any errors present on the form */
const _Errors = ({ status }) => (
	status.error ? (
		<div className="error">
			<span className="error-title">Error:</span>
			<span>{status.error}</span>
		</div>
	) : null
)
const Errors = connectForm(_Errors);
```

## Validation

Mu-forms provides access to the native HTML5 input validation. `connectForm` passes the `invalid` 
prop to the connected component, which can be used to change the class or display messaging.  The 
`invalid` property reflects the native HTML5 input validity based on `required`, `pattern`, etc. 
including custom HTML5 validity. Mu-forms provides the ability to set custom validation by passing a 
`validate` function to your connected form field. The `validate` function gets passed three arguments.

-   `value` - The value of the current field.
-   `data`  - The complete current form data.
-   `name`  - The name of the current field. (useful if you use one function for multiple fields).

The `validate` function just has to return a `boolean`, and mu-forms will set the native 
custom validity for you.

## Submitting

Mu-forms will only call the `onSubmit` property of the `<Form>` component once all the validations have been met.
If submission is attempted and the form is still invalid, the form element is marked with the `invalid` attribute, and
`status.invalid` is set to true until all inputs become valid again.
`onSubmit` gets called with two arguments:

-   `data` - The complete form data.
-   `form` - The underlying html form element.

`onSubmit` may return a `Promise` in which case the form will be marked with the `submitting` attribute and `status.submitting`
will be set to true until the `Promise` either resolves or rejects. 

-   If the promise resolves, `onSubmitted` is called with the resolved value. 
-   If the promise rejects, `status.error` is set to the error value returned from the promise.
-   If `onSubmit` does not return a promise, `onSubmitted` is called immediately with whatever value 
    `onSubmit` returned as it's only argument.

With this behavior, it is easy to style the form so that invalid inputs only show as invalid once 
the user has attempted to submit. 

```css
form[invalid] .invalid { 
	color : red 
} 
```

You can also easily integrate with an asynchronous method of submitting the data such as `fetch`, 
while showing a loading state to the user. The loading state can either be toggled using `connectForm`
and listening to `status.submitting`, or by showing the loading spinner with css like so:

```css
.spinner {
	display: none;
}
form[submitting] .spinner {
	display: block;
}
```

Error states can also easily be handled by simply rejecting the promise with a value that you can
later use to generate a user friendly message. You can simply create an error component and connect 
it to the form with `connectForm`. As soon as the Promise returned by `onSubmit` becomes rejected,
`status.error` will be updated with error value caught by the Promise.

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Form](#form)
-   [onChange](#onchange)
-   [onSubmit](#onsubmit)
-   [onSubmitted](#onsubmitted)
-   [connectForm](#connectform)

## Form

[src/common/form.js:35-170](https://github.com/MobiusHorizons/mu-forms/blob/b4422ac4f9ab839fda8375e282e2dd810b4a8708/src/common/form.js#L35-L170 "Source code on GitHub")

**Extends Component**

The `<Form>` component will store the data from any connected inputs. It will call `onSubmit` 
if the form is submitted (user presses enter, or clicks on a submit button), and is valid, 
`onSubmit` is called with two arguments: `data` and `form`.

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `props.onChange` **[onChange](#onchange)** 
    -   `props.onSubmit` **[onSubmit](#onsubmit)** 
    -   `props.onSubmitted` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 
    -   `props.initialState` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `context`  

## onChange

[src/common/form.js:102-119](https://github.com/MobiusHorizons/mu-forms/blob/b4422ac4f9ab839fda8375e282e2dd810b4a8708/src/common/form.js#L102-L119 "Source code on GitHub")

The function passed to `onChange` will be called whenever the ford data is updated.

**Parameters**

-   `data` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An Object containing the complete form data.
-   `valid` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** a Boolean set to true if all the form elements are valid.

## onSubmit

[src/common/form.js:102-119](https://github.com/MobiusHorizons/mu-forms/blob/b4422ac4f9ab839fda8375e282e2dd810b4a8708/src/common/form.js#L102-L119 "Source code on GitHub")

The function passed to `onSubmit` will be called when the form is submitted, and all
validations have been met.

**Parameters**

-   `data` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An Object containing the complete form data
-   `form` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** The underlying form element

**Examples**

```javascript
// post data to external api as JSON
(data) => fetch({ 
   method : 'post',
   url    : '/api/update/my/thing',
   body   : JSON.stringify(data),
}).then(r => {
   // any 2XX status will return the JSON data to `onSubmitted`
   if (r.ok) return r.json();

   // status.error will be set with the JSON value returned for this error
   return r.json().then(body => Promise.reject(body));
})
```

```javascript
(data) => promise.reject('Closed for Business')
```

Returns **([Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** If `onSubmit` returns a Promise, the form is marked as `submitting` until the promise 
either resolves or rejects.-   If the promise resolves, `onSubmitted` is called with the value returned from the promise.
-   If the promise rejects, `status.error` is set to the error value returned from the promise.If `onSubmit` does not return a Promise, `onSubmitted` is immediately called. 
`onSubmitted` has only one argument, which is the value returned from `onSubmit`.

## onSubmitted

[src/common/form.js:102-119](https://github.com/MobiusHorizons/mu-forms/blob/b4422ac4f9ab839fda8375e282e2dd810b4a8708/src/common/form.js#L102-L119 "Source code on GitHub")

The function passed to `onSubmitted` will be called once the submission is considered complete.
That is, either after the `onSubmit` has completed synchronously, or after a promise returned
by `onSubmit` has resolved.

**Parameters**

-   `value` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** The value returned by onSubmit synchronously, or returned by a Promise asynchronously.

## connectForm

[src/common/connect.js:87-122](https://github.com/MobiusHorizons/mu-forms/blob/b4422ac4f9ab839fda8375e282e2dd810b4a8708/src/common/connect.js#L87-L122 "Source code on GitHub")

Wire up a component to the `<Form>`, giving it access to form data as `status`. If the connected component 
is passed a `name` property, then the component also gets the `value`, `invalid` and `onChange` properties.

If the `name` property is present, a form element with the same `name` **must** be included inside the form.
This is required in order to use the native HTML5 validity. If you are not using an input 
element as part of the UI, it is perfectly acceptable to create a `display: none` input that 
simply reflects the same validity. for example:

    <input value={value} style={{ display : 'none' }} {...props} />

 **Note:** the input only needs to reflect the same validity, so if you are only concerned 
 with `required` for instance, you can store a complex (non-string) value in the state, while 
 simply storing a placeholder in the input (for example: `value={value == undefined ? '' : '__NOT_EMPTY__' }`)

`onChange(e)` is a function which expects a `change` or `input` event from a native HTML element.
If you need to pass it data in a different format, you can use `mapEvent` to change the data 
into the correct format.

**Parameters**

-   `Child` **Component** Component to be wrapped
-   `mapEvent` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** (Optional) maps the input to `onChange` to the value to be stored. -   String arguments are treated as a `.` delimited path.
    -   Functions are passed the argument to `onChange`, and the result is stored in state.

**Examples**

```javascript
// view only
const _Debug = (props) => (
    <pre>{JSON.stringify(props, null, 4)}</pre>
); 
const Debug = connectForm(_Debug);
<Form>
    <Debug />
    ....
</Form>
```

```javascript
// Wrapped input
const _Input = ({ status, onChange, invalid, className, ...props }) => (
    <input 
        className={invalid ? 'invalid ' + className : className}
        onInput={onChange}
        {...props} 
    />
);
const Input = connectForm(_Input);

<Form onSubmit={(data) => console.log(data)}>
    <Input name="test" required />
    <button type="submit">Submit</button>
</Form>
```

Returns **Component** ConnectedComponent
