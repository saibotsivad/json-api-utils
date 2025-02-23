<script>
	import { createEventDispatcher } from 'svelte'
	import debounce from 'just-debounce-it'
	import _diff from 'just-diff'
	const { diff } = _diff

	/** @type {import('..').JsonApiSvelteForm} */
	export let form
	/** @type string */
	export let id
	/**
	 * Note that the keypath array can only be up to 6 tokens in length, e.g. "/1/2/3/4/5/6"
	 * is the most that can be handled.
	 * @type {Array<string>}
	 * */
	export let tokens
	/** @type {number|undefined} */
	export let debounceMillis

	/*
	Because the diff calculation is expensive, we debounce so that e.g. entering text
	rapidly won't cause a sudden pile of blocking diff calculations to slow the UI.
	 */
	const dispatch = createEventDispatcher()
	const change = debounce(
		(updatedValue) => {
			if (!form?.data?.[id]) {
			// TODO this kind of error-appender anywhere there's an error state
				form.errors = form.errors || { other: [], mapped: {} }
				form.errors.other = form.errors.other || []
				if (!form.errors.other.find(e => e.meta?.formErrorId === id)) {
					form.errors.other.push({
						code: 'Incorrectly Generated Form',
						detail: `Field was created but was not found on the form. [id=${id},keypath=/${tokens.join('/')}]`,
						meta: { formErrorId: id }
					})
				}
				return
			}
			let [ k1, k2, k3, k4, k5, k6 ] = tokens
			let l = tokens.length
			/*
			The Svelte compiler looks for reassignment as the method to detect whether a
			function inside a component is modifying a bound value. Because of this, the
			reassignment process can't use the normal shortcut found in e.g. @lukeed/dset,
			thus the following method which is limited in depth.
			 */
			l > 0 && (form.data[id][k1] ?? (form.data[id][k1] = {}))
			l > 1 && (form.data[id][k1][k2] ?? (form.data[id][k1][k2] = {}))
			l > 2 && (form.data[id][k1][k2][k3] ?? (form.data[id][k1][k2][k3] = {}))
			l > 3 && (form.data[id][k1][k2][k3][k4] ?? (form.data[id][k1][k2][k3][k4] = {}))
			l > 4 && (form.data[id][k1][k2][k3][k4][k5] ?? (form.data[id][k1][k2][k3][k4][k5] = {}))
			l > 5 && (form.data[id][k1][k2][k3][k4][k5][k6] ?? (form.data[id][k1][k2][k3][k4][k5][k6] = {}))
			if (l === 1) form.data[id][k1] = updatedValue
			if (l === 2) form.data[id][k1][k2] = updatedValue
			if (l === 3) form.data[id][k1][k2][k3] = updatedValue
			if (l === 4) form.data[id][k1][k2][k3][k4] = updatedValue
			if (l === 5) form.data[id][k1][k2][k3][k4][k5] = updatedValue
			if (l === 6) form.data[id][k1][k2][k3][k4][k5][k6] = updatedValue

			form.changes[id] = diff(form.original[id] || {}, form.data[id] || {})
			if (!form.changes[id].length) delete form.changes[id]
			if (Object.keys(form.changes).length) form.state = 'changed'
			else form.state = 'unchanged'
			dispatch('change', { id, keypath: tokens, value: updatedValue })
		},
		debounceMillis || 15,
		true
	)

	/**
	 * Set the field value. Note that you'll need to take care of casting empty strings
	 * to `undefined`, or strings to numbers, etc.
	 *
	 * @type {import('..').set}
	 */
	export const set = (v) => {
		// the timeout is used to let the form state settle after a create
		setTimeout(() => { change(v) }, 0)
	}
</script>

<slot {set} />
