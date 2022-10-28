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

let index = -1;
let transformation = 0;


function render(time)
{
    window.requestAnimationFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const uCtm = gl.getUniformLocation(program, "uCtm");

    if(index != -1){
        instances[index].px = document.getElementById("px").value;
        instances[index].py = document.getElementById("py").value;
        instances[index].pz = document.getElementById("pz").value;
        instances[index].sx = document.getElementById("sx").value;
        instances[index].sy = document.getElementById("sy").value;
        instances[index].sz = document.getElementById("sz").value;
        instances[index].rx = document.getElementById("rx").value;
        instances[index].ry = document.getElementById("ry").value;
        instances[index].rz = document.getElementById("rz").value;
    
        instances[index].mod = getmModel(index);
    }

    for(let i = 0; i<instances.length; i++){
        gl.uniformMatrix4fv(uCtm, false, flatten(mult(mProjection, mult(mView, instances[i].mod))));
        instances[i].obj.draw(gl, program, gl.LINES);
    }

}

function getmModel(i=-1){  
    let px, py, pz, sx, sy, sz, rx, ry, rz;
    if(i==-1){
        px = document.getElementById("px").value;
        py = document.getElementById("py").value;
        pz = document.getElementById("pz").value;
    
        sx = document.getElementById("sx").value;
        sy = document.getElementById("sy").value;
        sz = document.getElementById("sz").value;
    
        rx = document.getElementById("rx").value;
        ry = document.getElementById("ry").value;
        rz = document.getElementById("rz").value;
    }
    else{
        px = instances[i].px;
        py = instances[i].py;
        pz = instances[i].pz;

        sx = instances[i].sx;
        sy = instances[i].sy;
        sz = instances[i].sz;
    
        rx = instances[i].rx;
        ry = instances[i].ry;
        rz = instances[i].rz;
    }

    let t = translate(px, py, pz);
    let s = scalem(sx, sy, sz);
    let Rx = rotateX(rx);
    let Ry = rotateY(ry);
    let Rz = rotateZ(rz);


    switch(transformation % 5){
        case 0:
            return mult(t, mult(Rz, mult(Ry, mult(Rx, s))));
        case 1:
            return mult(t, mult(s, mult(Rz, mult(Ry, Rx))));
        case 2:
            return mult(s, mult(t, mult(Rz, mult(Ry, Rx))));
        case 3:
            return mult(Rz, mult(Ry, mult(Rx, mult(s, t))));
        case 4: 
            return mult(s, mult(Rz, mult(Ry, mult(Rx, t))));
    }
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
        instances.push({
            obj: CUBE, 
            mod: getmModel(),
            px: document.getElementById("px").value,
            py: document.getElementById("py").value,
            pz: document.getElementById("pz").value,
            sx: document.getElementById("sx").value,
            sy: document.getElementById("sy").value,
            sz: document.getElementById("sz").value,
            rx: document.getElementById("rx").value,
            ry: document.getElementById("ry").value,
            rz: document.getElementById("rz").value
        });
        let select = document.getElementById('object_instances');

        var opt = document.createElement('option');
        opt.value = instances.length;
        opt.innerHTML = "Cube " + ++cubeCount;
        select.appendChild(opt);
    });

    document.getElementById("add_sphere").addEventListener("click", function(){
        instances.push({
            obj: SPHERE, 
            mod: getmModel(),
            px: document.getElementById("px").value,
            py: document.getElementById("py").value,
            pz: document.getElementById("pz").value,
            sx: document.getElementById("sx").value,
            sy: document.getElementById("sy").value,
            sz: document.getElementById("sz").value,
            rx: document.getElementById("rx").value,
            ry: document.getElementById("ry").value,
            rz: document.getElementById("rz").value,
        });
        let select = document.getElementById('object_instances');

        var opt = document.createElement('option');
        opt.value = instances.length;
        opt.innerHTML = "Sphere " + ++sphereCount;
        select.appendChild(opt);
    });

    document.getElementById("btn_remove").addEventListener("click", function(){
        if(index != -1)
            instances
        instances.pop();
        document.getElementById('object_instances').remove(instances.length);
    });

    document.getElementById("object_instances").addEventListener("change", function(){
        let select = document.getElementById("object_instances");
        index = select.selectedIndex;

        document.getElementById("px").value = instances[index].px
        document.getElementById("py").value = instances[index].py
        document.getElementById("pz").value = instances[index].pz
        document.getElementById("sx").value = instances[index].sx
        document.getElementById("sy").value = instances[index].sy
        document.getElementById("sz").value = instances[index].sz
        document.getElementById("rx").value = instances[index].rx
        document.getElementById("ry").value = instances[index].ry
        document.getElementById("rz").value = instances[index].rz
    })

    document.getElementById("transform_container").addEventListener("change", function() {
        instances[index].px = document.getElementById("px").value;
        instances[index].py = document.getElementById("py").value;
        instances[index].pz = document.getElementById("pz").value;
        instances[index].sx = document.getElementById("sx").value;
        instances[index].sy = document.getElementById("sy").value;
        instances[index].sz = document.getElementById("sz").value;
        instances[index].rx = document.getElementById("rx").value;
        instances[index].ry = document.getElementById("ry").value;
        instances[index].rz = document.getElementById("rz").value;

        instances[index].mod = getmModel();
    })

    document.addEventListener("keydown", function(event){
        if(event.key == "t"){
            transformation++;
            for(let i = 0; i < instances.length; i++)
                instances[i].mod = getmModel(i);

            switch(transformation % 5){
                case 0:
                    document.getElementById("tranform_method").innerHTML = "S -> R -> T"
                    break;
                case 1:
                    document.getElementById("tranform_method").innerHTML = "R -> S -> T"
                    break;
                case 2:
                    document.getElementById("tranform_method").innerHTML = "R -> T -> S"
                    break;
                case 3:
                    document.getElementById("tranform_method").innerHTML = "T -> S -> R"
                    break;
                case 4: 
                    document.getElementById("tranform_method").innerHTML = "T -> R -> S"
                    break;
            }
        }
    })

    window.requestAnimationFrame(render);
}

const shaderUrls = ['shader.vert', 'shader.frag'];

loadShadersFromURLS(shaderUrls).then(shaders=>setup(shaders));