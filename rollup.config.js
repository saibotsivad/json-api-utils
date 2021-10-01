import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import npmRun from 'rollup-plugin-npm-run'

const watch = process.env.ROLLUP_WATCH

export default [
	{
		input: 'lib/mapper.js',
		output: [
			{
				file: 'mapper/index.js',
				format: 'es'
			},
			{
				file: 'mapper/index.cjs',
				format: 'cjs'
			},
		],
		external: [
			'klona/json',
			'pointer-props'
		]
	},
	{
		input: 'src/index.js',
		output: [
			{
				file: 'dist/index.js',
				format: 'es'
			},
			{
				file: 'dist/index.cjs',
				format: 'cjs'
			},
		],
		plugins: [
			commonjs(),
			svelte(),
			resolve()
		]
	},
	{
		input: 'docs/app.js',
		output: {
			file: 'docs/build/app.js',
			format: 'iife'
		},
		plugins: [
			commonjs(),
			svelte(),
			resolve(),
			watch && npmRun('serve')
		]
	},
]
