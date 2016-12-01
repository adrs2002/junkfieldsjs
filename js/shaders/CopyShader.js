/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity": { value: 1.0 },
		"nigths": { value: 0.0 }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float opacity;",
		"uniform float nigths;",
		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			//"gl_FragColor = texel;",
			"float v = max(max(texel.r, texel.g), texel.b);",
			"vec4 gcol = vec4(0.0, v, 0.0, 1.0);",

			//"gl_FragColor.rgb = texel.rgb * opacity;",
			"gl_FragColor.r = mix(texel.r, gcol.r, nigths );",	//mixはlerpと同じ
			"gl_FragColor.g = mix(texel.g, gcol.g, nigths );",
			"gl_FragColor.b = mix(texel.b, gcol.b, nigths );",
			"gl_FragColor.a = 1.0;",
		"}"

	].join("\n")

};
