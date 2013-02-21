define(["Compose"], function(Compose) {

	function getShader(gl, id) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) {
			return null;
		}

		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}
			k = k.nextSibling;
		}

		var shader;
		if (shaderScript.type == "x-shader/x-fragment") {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			return null;
		}

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}


	var shaderProgram;

	function initShaders(gl) {
		var fragmentShader = getShader(gl, "shader-fs");
		var vertexShader = getShader(gl, "shader-vs");

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}

		gl.useProgram(shaderProgram);

		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	   /* shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);*/
		shaderProgram.lightIntensity = gl.getUniformLocation(shaderProgram, "lightIntensity");
		shaderProgram.halfDistance = gl.getUniformLocation(shaderProgram, "halfDistance");
		shaderProgram.color = gl.getUniformLocation(shaderProgram, "color");

		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	}


	var Renderer = Compose(function(canvas) {

		// set canvas
		this.canvas = canvas;

		// try to initialize WebGL
		try {
			this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			this.gl.viewportWidth = canvas.width;
			this.gl.viewportHeight = canvas.height;
		} catch (e) {
			alert("Error encountered while initializing WebGL: " + e);
		}
		if (!this.gl) {
			alert("Could not initialise WebGL, sorry :-(");
		}

		// initialize the matrices
		this.mvMatrix = mat4.create();
		this.pMatrix = mat4.create();

		// camera location
		this.camera = vec3.fromValues(0, 0, -2);

		// initialize the shaders
		initShaders(this.gl);
	},
	{
		viewportToWorld: function(elementLoc) {
			var viewportLoc = vec3.fromValues(elementLoc[0] / this.canvas.width * 2 - 1, -(elementLoc[1] / this.canvas.height * 2 - 1), 0.0);
			var worldLoc = vec3.create();
			vec3.transformMat4(worldLoc, viewportLoc, this.pMatrixInv);
			return worldLoc;
		},

		getGL: function() {
			return this.gl;
		},

		setScene: function(scene) {
			this.scene = scene;
		},

		draw: function() {
			var gl = this.gl;

			// sort the scene
			this.scene.sort();

			// set up the viewport appropriately
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.BLEND);
			gl.disable(gl.DEPTH_TEST);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			// generate the view matrix
			var viewMatrix = mat4.create();
			mat4.lookAt(viewMatrix, this.camera, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

			// set the projection matrix
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, this.pMatrix);
			mat4.multiply(this.pMatrix, viewMatrix, this.pMatrix);
			//mat4.ortho(this.pMatrix, -1, 1, -1, 1, 0.0, 5.0);
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, this.pMatrix);
			this.pMatrixInv = mat4.create();
			mat4.invert(this.pMatrixInv, this.pMatrix);
			var cameraInv = vec3.create();
			vec3.negate(cameraInv, this.camera);
console.log("Render " + this.scene.objects.length + " lights");
			// go over all objects in the scene in order and draw them
			for (var i = 0; i < this.scene.objects.length; ++i) {
				var obj = this.scene.objects[i];

				// set the modelview matrix
				mat4.identity(this.mvMatrix);
				mat4.translate(this.mvMatrix, this.mvMatrix, cameraInv);
				mat4.translate(this.mvMatrix, this.mvMatrix, obj.loc);

				// we bind the position buffer - this contains the vertices
				gl.bindBuffer(gl.ARRAY_BUFFER, obj.positionBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj.positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

				// we copy the modelview and projection matrix to the GPU
				gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.mvMatrix);

				// we set the light-related uniforms
				gl.uniform1f(shaderProgram.lightIntensity, obj.intensity);
				gl.uniform1f(shaderProgram.halfDistance, obj.halfDistance);
				gl.uniform3f(shaderProgram.color, obj.color[0], obj.color[1], obj.color[2]);

				// we render the object
				gl.drawArrays(gl.TRIANGLES, 0, obj.positionBuffer.numItems);
			}
		}
	});

	return Renderer;
});