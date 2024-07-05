function setupAttributes() {
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.lightingDirectionUniform2 = gl.getUniformLocation(shaderProgram, "uLightingDirection2");    //BLABLA EDW
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    shaderProgram.directionalColorUniform2 = gl.getUniformLocation(shaderProgram, "uDirectionalColor2");	//BLABLA EDW
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
}

let triangleVertexPositionBuffer;
let triangleVertexColorBuffer;
let triangleIndexBuffer;

let squareVertexPositionBuffer;
let squareVertexColorBuffer;
let squareIndexBuffer;

var spherePositionBuffer;
var sphereIndexBuffer;
var sphereNormalBuffer;
var sphereColorBuffer;
let sphere = createSphere(30, 30, 0.5);


function initBuffers() {
    //PYRAMID
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    let vertices = [
        0.0, 1.0, 0.0,  // Front triangle
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,

        0.0, 1.0, 0.0,  // Right triangle
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,

        0.0, 1.0, 0.0,  // Left triangle
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,

        0.0, 1.0, 0.0,  // Back triangle
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,

        -1.0, -1.0, -1.0,   // Base
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0

    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // We send the vertex positions to the buffer in our GPU.
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 12;

    triangleIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
    let indexes = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        14, 15, 12
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
    triangleIndexBuffer.itemSize = 1;
    triangleIndexBuffer.numItems = 12;

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

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
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = 16;



    //CUBE 
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [

        - 1.0, 1.0, 0.5,    //Top 4?
        -1.0, -1.0, 0.5,
        1.0, -1.0, 0.5,
        1.0, 1.0, 0.5,

        -1.0, 1.0, -0.5,    //Bottom 4?
        -1.0, -1.0, -0.5,
        1.0, -1.0, -0.5,
        1.0, 1.0, -0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 8;

    squareIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
    indexes = [
        0, 1, 2,// Top Face
        0, 3, 2,
        0, 4, 3,// Back Face
        3, 7, 4,
        3, 7, 2,// Right Face
        2, 6, 7,
        5, 6, 7,// Bottom Face
        5, 4, 7,
        1, 5, 4,// Left Face
        1, 4, 0,
        1, 5, 2,// Front Face
        2, 5, 6
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
    squareIndexBuffer.itemSize = 1;
    squareIndexBuffer.numItems = 36;


    squareVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBuffer.itemSize = 4;
    squareVertexColorBuffer.numItems = 12;

    //SPHERE

    spherePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, spherePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.positions), gl.STATIC_DRAW);
    spherePositionBuffer.itemSize = 3;
    spherePositionBuffer.numItems = sphere.positions.length / 3;

    sphereIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.indices), gl.STATIC_DRAW);
    sphereIndexBuffer.itemSize = 1;
    sphereIndexBuffer.numItems = sphere.indices.length;

    sphereNormalBuffer = gl.createBuffer(); // ** Normals for the sphere. Notice how we define the buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.normals), gl.STATIC_DRAW);
    sphereNormalBuffer.itemSize = 3; // A normal is defined by X Y Z
    sphereNormalBuffer.numItems = sphere.normals.length / 3;

    sphereColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.colors), gl.STATIC_DRAW);
    sphereColorBuffer.itemSize = 4;
    sphereColorBuffer.numItems = sphere.colors.length / 4;

}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-3.0, 0.0, 2.0]);
    //COLORS

    lightingDirection = [0.0, -1.0, 0.0];//Color 1
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, negateVec(normalize(lightingDirection))); // ** We pass the direction to the shader.

    var lightColor = [0.8, 0.0, 0.0];
    gl.uniform3fv(shaderProgram.directionalColorUniform, lightColor); // ** We pass the directional color.

    lightingDirection2 = [0.0, 1.0, 0.0];//Color 2	//BLABLA EDW
    gl.uniform3fv(shaderProgram.lightingDirectionUniform2, negateVec(normalize(lightingDirection2))); // ** We pass the direction to the shader. //BLABLA EDW

    var lightColor2 = [0.0, 0.0, 1.0];				//BLABLA EDW
    gl.uniform3fv(shaderProgram.directionalColorUniform2, lightColor2); // ** We pass the directional color.			//BLABLA EDW



    var ambient = [0.1, 0.1, 0.1];
    gl.uniform3fv(shaderProgram.ambientColorUniform, ambient);

    //SPHERE

    mat4.translate(mvMatrix, [4.0, 0.0, -6.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, spherePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, spherePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphereColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);

    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, sphereIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    //PYRAMID
    mat4.translate(mvMatrix, [-1.25, 0.0, -3.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);



    //CUBE
    mat4.translate(mvMatrix, [-2.55, 0.0, -2.8]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);

    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, squareIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    setupAttributes();
    initBuffers();

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}
