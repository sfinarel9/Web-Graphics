function draw(obj, texture) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.positions);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj.positions.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.normals);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, obj.normals.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoords);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, obj.texCoords.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(shaderProgram.specularColor, [1.0, 1.0, 1.0]);
    gl.uniform1f(shaderProgram.hardness, 15.0);

    var ambient = [0.06, 0.06, 0.06];
    gl.uniform3fv(shaderProgram.ambientColorUniform, ambient); 

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.tex);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);
    gl.drawElements(gl.TRIANGLES, obj.indices.numItems, gl.UNSIGNED_SHORT, 0);
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image); // ** loads the image data to our texture.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // ** Filter used for dispaying the image at more than 100% it's size. (gl.LINEAR, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    // ** Filter used for dispaying the image at less than 100% it's size. (gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_LINEAR.)

    gl.generateMipmap(gl.TEXTURE_2D); // ** We create mipmaps.

    gl.bindTexture(gl.TEXTURE_2D, null); // ** unbind texture.
}

function initTexture(texture, url) {
    texture.tex = gl.createTexture(); // ** We create our texture.
    texture.tex.image = new Image(); // ** We create an image
    texture.tex.image.src = url; // ** We load the image we will use as our texture.
    texture.tex.image.onload = function () {
        handleLoadedTexture(texture.tex);
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

    shaderProgram.specularColor = gl.getUniformLocation(shaderProgram, "uSpecularColor");
    shaderProgram.hardness = gl.getUniformLocation(shaderProgram, "uHardness");


    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
}

let planetBuffers = {}; // We create an object to store vertex buffers and other properties.
let earthTexture = {}; // Here we store texture buffers.
let moonTexture = {};
let sunTexture = {};
let marsTexture = {};

function initBuffers() {
    let planet = createSphere(30, 30, 1);

    planetBuffers.positions = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planetBuffers.positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planet.positions), gl.STATIC_DRAW);
    planetBuffers.positions.itemSize = 3;
    planetBuffers.positions.numItems = planet.positions.length / 3;

    planetBuffers.normals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planetBuffers.normals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planet.normals), gl.STATIC_DRAW);
    planetBuffers.normals.itemSize = 3;
    planetBuffers.normals.numItems = planet.normals.length / 3;

    planetBuffers.texCoords = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planetBuffers.texCoords);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planet.texCoords), gl.STATIC_DRAW);
    planetBuffers.texCoords.itemSize = 2;
    planetBuffers.texCoords.numItems = planet.texCoords.length / 2;

    planetBuffers.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planetBuffers.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planet.indices), gl.STATIC_DRAW);
    planetBuffers.indices.itemSize = 1;
    planetBuffers.indices.numItems = planet.indices.length;

    initTexture(earthTexture, "earth.jpg"); // We call initTexture from here with an empty object and a url of an image
    initTexture(moonTexture, "moon.jpg");
    initTexture(sunTexture, "sun.jpg");
    initTexture(marsTexture, "mars.jpg");

}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    gl.uniform3fv(shaderProgram.lightingDirectionUniform, negateVec(normalize([1.0, 0.0, -0.5])));
    gl.uniform3fv(shaderProgram.directionalColorUniform, [0.6, 0.6, 0.6]);

    mat4.identity(mvMatrix);


    mat4.translate(mvMatrix, [0, 0, -15]);
    mat4.rotate(mvMatrix, degToRad(0), [1, 0, 0]); //sun rotating

    //SUN
    pushMatrix(mvMatrix); // START BIG PLANET TRANSFORMATIONS.

    //MARS
    mat4.rotate(mvMatrix, degToRad(yRot ), [0, 1, 0]); //Mars rotating around sun

    pushMatrix(mvMatrix);
    mat4.translate(mvMatrix, [6, -1, 5]);

    mat4.scale(mvMatrix, [1.3, 1.3, 1.3]);
    mat4.rotate(mvMatrix, degToRad(yRot * 4.5), [0, 1, 0]); //Mars rotating around himself

    setMatrixUniforms();
    draw(planetBuffers, marsTexture);

    mvMatrix = popMatrix();
    //End Mars

    mat4.rotate(mvMatrix, degToRad(yRot * 2), [0, 1, 0]);
    //EARTH
    pushMatrix(mvMatrix); // START SMALL PLANET TRANSFORMATIONS.
    mat4.translate(mvMatrix, [2.5, -1, 4]);
    mat4.rotate(mvMatrix, degToRad(-yRot * 4), [0, 1, 0]); //Earth rotating around herself

    setMatrixUniforms();
    draw(planetBuffers, earthTexture);
    //MOON
    pushMatrix(mvMatrix);
    mat4.rotate(mvMatrix, degToRad(-yRot * 2.5), [0, 1, 0]); //Moon rotating around earth
    mat4.translate(mvMatrix, [2, 1, 0]);
    mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);
    setMatrixUniforms();
    draw(planetBuffers, moonTexture);

    mvMatrix = popMatrix();//End Moon
    mvMatrix = popMatrix();//End Mars



    mat4.scale(mvMatrix, [2, 2, 2]);
    setMatrixUniforms();
    draw(planetBuffers, sunTexture);
    mvMatrix = popMatrix();


}

//  animation
var lastTime = 0;
var yRot = 0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        yRot += (20 * elapsed) / 1000.0;
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
