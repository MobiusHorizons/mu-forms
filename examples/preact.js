/** @jsx h */
import { h, render } from 'preact';
import { Form, connectForm } from '../preact';

/** Framework code **/

const _Status = ({ status }) => (
	<div class="status">
		<h1> Form Status </h1>
		<pre>{JSON.stringify(status, null, 4)}</pre>
	</div>
);
const Status = connectForm(_Status);

const _Errors = ({ status }) => (
	status.error ? (
		<div class="error">
			<span class="error-title">Error:</span>
			<span>{status.error}</span>
		</div>
	) : null
)
const Errors = connectForm(_Errors);

const _TextInput = ({ invalid, invalidText, onChange, label, status, ...props}) => (
	<label class="text-input" invalid={invalid}>
		<span class="text-input__label">{label}</span>
		<input onInput={onChange} {...props}/>
		<span class="text-input__invalid_text">{invalidText}</span>
	</label>
);
const TextInput = connectForm(_TextInput);

/** actual form implementation **/

function done(result) {
	alert('Form successfully submitted');
}

function submit(data) {
	/***
	 * To handle asynchronous submission, return a promise from `onSubmit`
	 * If the return value is a promise, the form will be marked as `submitting`
	 * that status is removed as soon as the promise resolves or rejects.
	 * if the promise resolves, `onSubmitted` is called.
	 * if the promise rejects, the value is stored under `status.error`
	 *
	 * The example below will error out if you use the email `error@example.com`
	 * It will succeed for any other value
	 ****/
	return new Promise((y,n) => {
		setTimeout(() => {
			if (data.email == 'error@example.com') {
				n('Oops Something went wrong...');
			} else {
				y();
			}
		}, 2400);
	});
}

const App = () => (
	<Form onSubmit={submit} onSubmitted={done}>
		<div class="form-group">
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
				<span class="loading" />
			</button>
		</div>

		<Status />
	</Form>
);

render(<App />, document.body);
