/*
  For more information about textures: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL

  *********OCTAHEDRON*********

  NOTE: As you can see, we don't need an index buffer for this
  mesh, since all of it's faces are triangles

  *********POSITION*********

  // Front up face
  0.0, 0.7, 0.0,
  -0.5, 0.0, 0.5,
  0.5, 0.0, 0.5,

  // Front down face
  0.0, -0.7, 0.0,
  -0.5, 0.0, 0.5,
  0.5, 0.0, 0.5,

  // Back up face
  0.0, 0.7, 0.0,
  -0.5, 0.0, -0.5,
  0.5, 0.0, -0.5,

  // Back down face
  0.0, -0.7, 0.0,
  -0.5, 0.0, -0.5,
  0.5, 0.0, -0.5,

  // Left up face
  0.0, 0.7, 0.0,
  -0.5, 0.0, -0.5,
  -0.5, 0.0, 0.5,

  // Left down face
  0.0, -0.7, 0.0,
  -0.5, 0.0, -0.5,
  -0.5, 0.0, 0.5,

  // Right up face
  0.0, 0.7, 0.0,
  0.5, 0.0, -0.5,
  0.5, 0.0, 0.5,

  // Right down face
  0.0, -0.7, 0.0,
  0.5, 0.0, -0.5,
  0.5, 0.0, 0.5




  *********NORMAL*********

  // Front up face
  0.0, 0.4472, 0.8944,
  0.0, 0.4472, 0.8944,
  0.0, 0.4472, 0.8944,

  // Front down face
  0.0, -0.4472, 0.8944,
  0.0, -0.4472, 0.8944,
  0.0, -0.4472, 0.8944,

  // Back up face
  0.0, 0.4472, -0.8944,
  0.0, 0.4472, -0.8944,
  0.0, 0.4472, -0.8944,

  // Back down face
  0.0, -0.4472, -0.8944,
  0.0, -0.4472, -0.8944,
  0.0, -0.4472, -0.8944,

  // Left up face
  -0.8944, 0.4472, 0.0,
  -0.8944, 0.4472, 0.0,
  -0.8944, 0.4472, 0.0,

  // Left down face
  -0.8944, -0.4472, 0.0,
  -0.8944, -0.4472, 0.0,
  -0.8944, -0.4472, 0.0,

  // Right up face
  0.8944, 0.4472, 0.0,
  0.8944, 0.4472, 0.0,
  0.8944, 0.4472, 0.0,

  // Right down face
  0.8944, -0.4472, 0.0,
  0.8944, -0.4472, 0.0,
  0.8944, -0.4472, 0.0
*/
function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image); // ** loads the image data to our texture.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // ** Filter used for dispaying the image at more than 100% it's size. (gl.LINEAR, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);// ** Filter used for dispaying the image at less than 100% it's size. (gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_LINEAR.)

    gl.generateMipmap(gl.TEXTURE_2D); // ** We create mipmaps.

    gl.bindTexture(gl.TEXTURE_2D, null); // ** unbind texture.
}


var boxTexture; // ** Global texture variable.

function initTexture() {
    boxTexture = gl.createTexture(); // ** We create our texture.
    boxTexture.image = new Image(); // ** We create an image
    boxTexture.image.src = "SSS.png"; // ** We load the image we will use as our texture.
    boxTexture.image.onload = function () {
        handleLoadedTexture(boxTexture);
    };
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    // Here we set and pass the uniform matrix that will rotate the normals in the vertex shader.
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function setupAttributes() {
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord"); // ** We get the attribute index for the texture coords attribute.
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute); // ** We enable the attribute.

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler"); // ** We get the uniform index.

    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}

var cubeVertexBuffer;
var cubeIndexBuffer;
var cubeNormalBuffer;
var cubeTexCoordBuffer;

function initBuffers() {
    cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    var positions = [
        // Front up face
        0.0, 0.7, 0.0,
        -0.5, 0.0, 0.5,
        0.5, 0.0, 0.5,

        // Front down face
        0.0, -0.7, 0.0,
        -0.5, 0.0, 0.5,
        0.5, 0.0, 0.5,

        // Back up face
        0.0, 0.7, 0.0,
        -0.5, 0.0, -0.5,
        0.5, 0.0, -0.5,

        // Back down face
        0.0, -0.7, 0.0,
        -0.5, 0.0, -0.5,
        0.5, 0.0, -0.5,

        // Left up face
        0.0, 0.7, 0.0,
        -0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,

        // Left down face
        0.0, -0.7, 0.0,
        -0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,

        // Right up face
        0.0, 0.7, 0.0,
        0.5, 0.0, -0.5,
        0.5, 0.0, 0.5,

        // Right down face
        0.0, -0.7, 0.0,
        0.5, 0.0, -0.5,
        0.5, 0.0, 0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    cubeVertexBuffer.itemSize = 3;
    cubeVertexBuffer.numItems = 24;

    cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    var indeces = [
        0, 1, 2, //U1
        3, 4, 5, //B1
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indeces), gl.STATIC_DRAW);
    cubeIndexBuffer.itemSize = 1;
    cubeIndexBuffer.numItems = 24;

    cubeNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
    var normals = [
        // Front up face
        0.0, 0.4472, 0.8944,
        0.0, 0.4472, 0.8944,
        0.0, 0.4472, 0.8944,

        // Front down face
        0.0, -0.4472, 0.8944,
        0.0, -0.4472, 0.8944,
        0.0, -0.4472, 0.8944,

        // Back up face
        0.0, 0.4472, -0.8944,
        0.0, 0.4472, -0.8944,
        0.0, 0.4472, -0.8944,

        // Back down face
        0.0, -0.4472, -0.8944,
        0.0, -0.4472, -0.8944,
        0.0, -0.4472, -0.8944,

        // Left up face
        -0.8944, 0.4472, 0.0,
        -0.8944, 0.4472, 0.0,
        -0.8944, 0.4472, 0.0,

        // Left down face
        -0.8944, -0.4472, 0.0,
        -0.8944, -0.4472, 0.0,
        -0.8944, -0.4472, 0.0,

        // Right up face
        0.8944, 0.4472, 0.0,
        0.8944, 0.4472, 0.0,
        0.8944, 0.4472, 0.0,

        // Right down face
        0.8944, -0.4472, 0.0,
        0.8944, -0.4472, 0.0,
        0.8944, -0.4472, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    cubeNormalBuffer.itemSize = 3;
    cubeNormalBuffer.numItems = 24;

    cubeTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
    // Here we tell every vertex it's position on the texture map. (UV mapping in blender)
    var texCoords = [
        0.5, 0.0,//U front
        0.0, 1.0,
        1.0, 1.0,

        0.5, 0.0,//B front
        0.0, 1.0,
        1.0, 1.0,

        0.5, 0.0,//U back
        0.0, 1.0,
        1.0, 1.0,

        0.5, 0.0,//B back
        0.0, 1.0,
        1.0, 1.0,

        0.5, 1.0,//U Left
        0.0, 1.0,
        0.0, 0.0,

        0.5, 0.0,//B left
        0.0, 1.0,
        0.0, 0.0,

        0.5, 0.0,//U right
        1.0, 1.0,
        1.0, 0.0,

        0.5, 0.0,//B right
        1.0, 1.0,
        1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    cubeTexCoordBuffer.itemSize = 2;
    cubeTexCoordBuffer.numItems = 24;
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    gl.uniform3fv(shaderProgram.lightingDirectionUniform, negateVec(normalize([1.0, 0.0, -1.0])));
    gl.uniform3fv(shaderProgram.directionalColorUniform, [1.0, 1.0, 1.0]);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0, 0, -4]);
    mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 1]); // We rotate the matrix.
    setMatrixUniforms();

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // There is a limited number of texture slots, that is, the number of textures that we can have active at the same time. (at least 8, usually 32 depending on the GPU).
    gl.activeTexture(gl.TEXTURE0); // ** We enable a Texture slot.
    gl.bindTexture(gl.TEXTURE_2D, boxTexture); // ** We bind the texture.
    gl.uniform1i(shaderProgram.samplerUniform, 0); // ** We pass the texture slot as a uniform in the fragment shader. Since the bound texture is 'boxTexture', that will be used.

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


}


//  animation
var lastTime = 0;
var yRot = 0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        yRot += (20 * elapsed) / 400.0;
    }
    lastTime = timeNow;
}

function tick() {
    requestAnimFrame(tick);
    animate();
    drawScene();
}


function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    setupAttributes();
    initBuffers();
    initTexture();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
