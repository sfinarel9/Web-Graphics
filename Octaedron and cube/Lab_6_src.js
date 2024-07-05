

function setupAttributes() {
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

let triangleVertexPositionBuffer;
let triangleVertexColorBuffer;
let squareVertexPositionBuffer;
let squareVertexColorBuffer;
let squareIndexBuffer;

function initBuffers() {
  triangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);


  let vertices = [
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // We send the vertex positions to the buffer in our GPU.
  triangleVertexPositionBuffer.itemSize = 3; // item size = 3 because (x, y, z).
  triangleVertexPositionBuffer.numItems = 24; // numItems = 3 because we have three vertices.

  triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

  // We define our vertex colors.
  let colors = [
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  triangleVertexColorBuffer.itemSize = 4; // item size = 4 because (R, G, B, A).
  triangleVertexColorBuffer.numItems = 24;


  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  vertices = [
    1.0, 1.0, 0.0,   // 0
    -1.0, 1.0, 0.0,   // 1
    -1.0, -1.0, 0.0,   // 2
    1.0, -1.0, 0.0    // 3
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  squareVertexPositionBuffer.itemSize = 3;
  squareVertexPositionBuffer.numItems = 4;

  squareIndexBuffer = gl.createBuffer(); // **
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer); // We bind the IBO as an ELEMENT_ARRAY_BUFFER.
  let indexes = [ // The indexes that will be loaded in the buffer
    0, 1, 2,
    2, 3, 0
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
  squareIndexBuffer.itemSize = 1; // item size = 1 because one index = one vertex.
  squareIndexBuffer.numItems = 6;

  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  squareVertexColorBuffer.itemSize = 4;
  squareVertexColorBuffer.numItems = 4;
}



function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  mat4.identity(mvMatrix);

  mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]); // We store a translation to our matrix, so when the first object is drawn it will be in that position.

  // We bind the vertex position buffer and we specify to the shader attribute how to read our data.
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Same thing for the color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms(); // We send the matrices to our shader.
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems); // FINALLY!!!!!! We draw our triangle

  mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer); // We bind the IBO.

  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, squareIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); // Since we have an IBO for the square, we use a different function to draw.
}



function webGLStart() {
  let canvas = document.getElementById("canvas");
  initGL(canvas);
  initShaders();
  setupAttributes();
  initBuffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}
