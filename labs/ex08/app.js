import { loadShadersFromURLS, loadShadersFromScripts, setupWebGL, buildProgramFromSources } from "../../libs/utils.js";
import { vec2, flatten } from "../../libs/MV.js";

/** @type {WebGLRenderingContext} */
var gl;
var program;

function setup(shaders)
{
    // Setup
    const canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas);

    program = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);

    const vertices = [ vec2(-0.5, -0.5), vec2(0.5, -0.5), vec2(0, 0.5) ];

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

function animate(arg)
{
    window.requestAnimationFrame(animate);

    // Drawing code
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const uColor = gl.getUniformLocation(program, "uColor");

    gl.uniform4f(uColor, 1.0, 0.0, 0.0, 1.0)

    const uDx = gl.getUniformLocation(program, "uDx")
    const uDy = gl.getUniformLocation(program, "uDy")

    gl.uniform1f(uDx, Math.sin(Math.random()*2-1))
    gl.uniform1f(uDy, Math.sin(Math.random()*2-1))

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.uniform4f(uColor, 1.0, 1.0, 1.0, 1.0)

    gl.drawArrays(gl.LINE_LOOP, 0, 3);
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders));