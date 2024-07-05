
let gl;

function negateVec(vec)
{
    if(!vec.hasOwnProperty("length"))
        return null;

    let nVec = vec.slice();
    for(let i = 0; i < nVec.length; i++)
    {
        nVec[i] *= -1;
    }

    return nVec;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function normalize(vec)
{
    if(!vec.hasOwnProperty("length"))
        return null;

    let normVec = vec.slice();
    let mag = magnitute(normVec);

    console.log(mag);
    for(let i = 0; i < normVec.length; i++)
    {
        normVec[i] /= mag;
    }
    return normVec;
}

function magnitute(vec)
{
    if(!vec.hasOwnProperty("length"))
        return null;

    pSum = 0;
    for(let n of vec)
    {
        pSum += Math.pow(n, 2);
    }

    return Math.sqrt(pSum);
}
function createSphere(latBands, longBands, r)
{
    // The code below defines the positions, colors, indices and normals of a sphere.

    var latitudeBands = latBands;
    var longitudeBands = longBands;
    var radius = r;

    let sphere = {
        positions : [],
        normals : [],
        colors : [],
        indices : []
    };

    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var cosTheta = Math.cos(theta);

        var green = latNumber%2;
        var blue = (latNumber+1)%2;

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            sphere.colors.push(1.0);
            sphere.colors.push(green);
            sphere.colors.push(blue);
            sphere.colors.push(1.0); // alpha channel

            sphere.normals.push(x);
            sphere.normals.push(y);
            sphere.normals.push(z);
            sphere.positions.push(radius * x);
            sphere.positions.push(radius * y);
            sphere.positions.push(radius * z);
        }
    }

    for (latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            sphere.indices.push(first);
            sphere.indices.push(second);
            sphere.indices.push(first + 1);

            sphere.indices.push(second);
            sphere.indices.push(second + 1);
            sphere.indices.push(first + 1);
        }
    }
    return sphere;
}

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

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

function initShaders() {
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

}

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000/60);
        };
})();
