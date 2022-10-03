import { loadShadersFromURLS, loadShadersFromScripts, setupWebGL, buildProgramFromSources } from "../../libs/utils.js";
import { vec2, vec3, vec4, flatten } from "../../libs/MV.js";

/** @type {WebGLRenderingContext} */
var gl;
var program;

function setup(shaders)
{
    // Setup
    const canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas);

    program = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);

    const vertices = [ vec2(-0.5, -0.5), vec2(0.5, -0.5), vec2(0, 0.5)];
    const colors = [vec4(1.0, 0.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0)];

    const aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, 4*(vertices.length*2 + colors.length * 4), gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    gl.bufferSubData(gl.ARRAY_BUFFER, 4*vertices.length*2, flatten(colors))

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 4*vertices.length*2);
    gl.enableVertexAttribArray(vColor);

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

    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders));
