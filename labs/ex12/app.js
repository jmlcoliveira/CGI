import { loadShadersFromURLS, setupWebGL, buildProgramFromSources } from '../../libs/utils.js';
import { mat4, vec3, flatten, lookAt, ortho, mult, translate, rotateZ, scale, scalem, rotateX, rotateY} from '../../libs/MV.js';

import * as SPHERE from './js/sphere.js';
import * as CUBE from './js/cube.js';

/** @type {WebGLRenderingContext} */
let gl;

let program;

/** View and Projection matrices */
let mView;
let mProjection;

const edge = 2.0;

let instances = [];
let cubeCount = 0;
let sphereCount= 0;


function render(time)
{
    window.requestAnimationFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const uCtm = gl.getUniformLocation(program, "uCtm");

    for(let i = 0; i<instances.length; i++){
        instances[i].obj.draw(gl, program, gl.LINES);
        gl.uniformMatrix4fv(uCtm, false, flatten(mult(mProjection, mult(mView, instances[i].mod))));
    }

}

function getmModel(){
    let px = document.getElementById("px").value;
    let py = document.getElementById("py").value;
    let pz = document.getElementById("pz").value;

    let t = translate(px, py, pz);

    let sx = document.getElementById("sx").value;
    let sy = document.getElementById("sy").value;
    let sz = document.getElementById("sz").value;

    let s = scalem(sx, sy, sz);

    let rx = document.getElementById("rx").value;
    let ry = document.getElementById("ry").value;
    let rz = document.getElementById("rz").value;

    let Rx = rotateX(rx);
    let Ry = rotateY(ry);
    let Rz = rotateZ(rz);

    return mult(t, mult(Rz, mult(Ry, mult(Rx, s))));
}



function setup(shaders)
{
    const canvas = document.getElementById('gl-canvas');

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = window.innerHeight;

    gl = setupWebGL(canvas);
    program = buildProgramFromSources(gl, shaders['shader.vert'], shaders['shader.frag']);

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);

    mView = lookAt(vec3(0,0,0), vec3(-1,-1,-2), vec3(0,1,0));
    setupProjection();

    SPHERE.init(gl);
    CUBE.init(gl);

    function setupProjection()
    {
        if(canvas.width < canvas.height) {
            const yLim = edge*canvas.height/canvas.width;
            mProjection = ortho(-edge, edge, -yLim, yLim, -10, 10);
        }
        else {
            const xLim = edge*canvas.width/canvas.height;
            mProjection = ortho(-xLim, xLim, -edge, edge, -10, 10);
        }

    }
    window.addEventListener("resize", function() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = window.innerHeight;

        setupProjection();
    
        gl.viewport(0,0,canvas.width, canvas.height);
    });

    document.getElementById("add_cube").addEventListener("click", function(){
        instances.push({obj: CUBE, mod: getmModel()});
        let select = document.getElementById('object_instances');

        var opt = document.createElement('option');
        opt.value = instances.length;
        opt.innerHTML = "Cube " + ++cubeCount;
        select.appendChild(opt);
    });

    document.getElementById("add_sphere").addEventListener("click", function(){
        instances.push({obj: SPHERE, mod: getmModel()});
        let select = document.getElementById('object_instances');

        var opt = document.createElement('option');
        opt.value = instances.length;
        opt.innerHTML = "Sphere " + ++sphereCount;
        select.appendChild(opt);
    });

    document.getElementById("btn_remove").addEventListener("click", function(){
        instances.pop();
        document.getElementById('object_instances').remove(instances.length);
    });

    document.getElementById("object_instances").addEventListener("click", function(){
        let select = document.getElementById("object_instances");
        let i = select.selectedIndex;
        console.log(instances[i]);
    })

    window.requestAnimationFrame(render);
}

const shaderUrls = ['shader.vert', 'shader.frag'];

loadShadersFromURLS(shaderUrls).then(shaders=>setup(shaders));