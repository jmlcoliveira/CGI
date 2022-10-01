import { loadShadersFromURLS, loadShadersFromScripts, setupWebGL, buildProgramFromSources } from "../../libs/utils.js";
import { vec2, flatten } from "../../libs/MV.js";

/** @type {WebGLRenderingContext} */
var gl;
var program;
var nTriang = 10000;
var vertices = [];

function setup(shaders)
{
    // Setup
    const canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas);

    program = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);

    const aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Setup the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Setup the background color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Call animate for the first time
    window.requestAnimationFrame(animate);
}

function animate()
{
    window.requestAnimationFrame(animate);

    // Drawing code
    gl.clear(gl.COLOR_BUFFER_BIT);

    vertices.length = 0;
    for(let i = 0; i <nTriang; i++){
        let x = Math.random() * 2 - 1//- Math.random();
        let y = Math.random() * 2 - 1//- Math.random();
        vertices.push(vec2(-0.01+x, -0.01+y), vec2(0.01+x, -0.01+y), vec2(0+x, 0.01+y))
    }
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3*nTriang);
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders));
