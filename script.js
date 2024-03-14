let canvas = document.querySelector("canvas");
canvas.style.backgroundColor = "yellow"; //To see if it is working

const webgl = canvas.getContext("webgl");
function createCubeVertices() {
  return [
    // Front face
    -0.6, -0.6, 1.0, 0.6, -0.6, 1.0, 0.6, 0.6, 1.0, -0.6, 0.6, 1.0,
    // Back face
    -0.6, -0.6, -0.0, -0.6, 0.6, -0.0, 0.6, 0.6, -0.0, 0.6, -0.6, -0.0,
    // Top face
    -0.6, 0.6, -0.0, -0.8, 0.6, 0.0, 0.6, 0.6, 0.0, 0.6, 0.6, -0.0,
    // Bottom face
    -0.6, -0.6, -1.0, 0.6, -0.6, -1.0, 0.6, -0.6, 1.0, -0.6, -0.6, 1.0,
    // Right face
    0.6, -0.6, -1.0, 0.6, 0.6, -1.0, 0.6, 0.6, 1.0, 0.6, -0.6, 1.0,
    // Left face
    -0.6, -0.6, -1.0, -0.6, -0.6, 1.0, -0.6, 0.6, 1.0, -0.6, 0.6, -1.0,
  ];
}
let vertices = createCubeVertices();
// console.log(vertices);
let buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(
  webgl.ARRAY_BUFFER,
  new Float32Array(vertices),
  webgl.STATIC_DRAW
);
let stat = webgl.getParameter(webgl.ARRAY_BUFFER_BINDING);
console.log("The current binded buffer", stat);

fetch("vsShader.glsl")
  .then((response) => {
    console.log(response.status);
    if (response.ok) {
      return response.text();
    } else {
      throw new Error("File is not found...");
    }
  })
  .then((VertexShaderSource) => {
    let vShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vShader, VertexShaderSource);
    webgl.compileShader(vShader);
    if (!webgl.getShaderParameter(vShader, webgl.COMPILE_STATUS)) {
      console.log(
        "There was an error in compiling the vertex Shader:",
        webgl.getShaderInfoLog(vShader)
      );
    }
    return fetch("fsShader.glsl")
      .then((response) => {
        console.log(response.status);
        if (response.ok) {
          console.log("the File was found and it is working");
          return response.text();
        } else {
          throw new Error(
            "the file was not found somehow, check the directory you put in"
          );
        }
      })
      .then((FragShaderSource) => {
        let fShader = webgl.createShader(webgl.FRAGMENT_SHADER);
        webgl.shaderSource(fShader, FragShaderSource);
        webgl.compileShader(fShader);
        if (!webgl.getShaderParameter(fShader, webgl.COMPILE_STATUS)) {
          console.log(
            "There was an error in compiling the vertex Shader:",
            webgl.getShaderInfoLog(fShader)
          );
        }
        let program = webgl.createProgram();
        webgl.attachShader(program, fShader);
        webgl.attachShader(program, vShader);
        webgl.linkProgram(program);
        webgl.useProgram(program);
        if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
          console.log(
            "There was an error in lINKING  the PROGRAM :",
            webgl.getProgramInfoLog(program)
          );
        }
        let Position = webgl.getAttribLocation(program, "vecposition");
        console.log(Position);
        webgl.enableVertexAttribArray(Position);
        webgl.clearColor(1.0, 0.2, 0.9, 1.0);
        webgl.clear(webgl.COLOR_BUFFER_BIT);
        webgl.vertexAttribPointer(Position, 3, webgl.FLOAT, false, 0, 0);
        let color = webgl.getUniformLocation(program, "color");
        // webgl.uniform3f(color, 0.2, 0.1, 1.0);
        // webgl.drawArrays(webgl.TRIANGLES, 0, 4);
        let transLocation = webgl.getUniformLocation(program, "Translate");
        webgl.uniform3f(color, 0.2, 1.0, 1.0);
        let x = 0.1, y = 0.1, z = 0.01;
        let mat4 ;
        console.log(mat4);
        let i = 0.01;
        webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 3);
        function draw()
        {   
            mat4 = rotateY(createIdentityMatrix(),Math.PI/500+i);
            console.log(mat4);
            webgl.clear(webgl.COLOR_BUFFER_BIT);
            webgl.uniformMatrix4fv(transLocation, false, mat4);
            webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 3);
            x = y = z = i;
            // if(i > 0.9)
            // {
            //     i = -i
            // }
            i += 0.01;
            window.requestAnimationFrame(draw);
        }
        draw();
      });
  });
function translate(matrix, tx, ty, tz) {
  return multiplyMatrices(matrix, [
    tx,
    0,
    0,
    0,
    0,
    ty,
    0,
    0,
    0,
    0,
    tz,
    0,
    0,
    0,
    0,
    1,
  ]);
}
function multiplyMatrices(matrix1, matrix2) {
  const result = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += matrix1[i * 4 + k] * matrix2[k * 4 + j];
      }
      result.push(sum);
    }
  }
  return result;
}
function createIdentityMatrix() {
return [
1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
];
}

function rotateX(matrix, angle) {
const sinAngle = Math.sin(angle);
const cosAngle = Math.cos(angle);
 return multiplyMatrices(matrix, [
1, 0, 0, 0,
0, cosAngle, sinAngle, 0,
0, -sinAngle, cosAngle, 0,
0, 0, 0, 1,
0, 0, 0, 1
]);
}
 function rotateZ(matrix, angle) {
const sinAngle = Math.sin(angle);
const cosAngle = Math.cos(angle);
 return multiplyMatrices(matrix, [
cosAngle, sinAngle, 0, 0,
-sinAngle, cosAngle, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
]);
}
 function rotateY(matrix, angle) {
const sinAngle = Math.sin(angle);
const cosAngle = Math.cos(angle);
 return multiplyMatrices(matrix, [
cosAngle, 0, -sinAngle, 0,
0, 1, 0, 0,
sinAngle, 0, cosAngle, 0,
0, 0, 0, 1,
0, 0, 0, 1
]);
}