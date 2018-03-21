const CONTEXT_TYPES = {
	form: () => {},
};

function filterJoin(values, sep) {
	return values 
		.filter(v => v != false && v != null && v != undefined)
		.join(sep);
}
function c(...classes) {
	return filterJoin(classes, ' ');
}

export {
	CONTEXT_TYPES,
	filterJoin,
	c,
};
