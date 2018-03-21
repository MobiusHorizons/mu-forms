import { _Form, _connectForm } from './common/index';

export default vdom => ({
	Form : _Form(vdom),
	connectForm : _connectForm(vdom),
});
