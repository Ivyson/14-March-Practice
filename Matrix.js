const MyMatrix = {};
function createIdentityMatrix() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
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

 function translate(matrix, tx, ty, tz) {
    return MyMatrix.multiplyMatrices(matrix, [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ]);
}

 function rotateX(matrix, angle) {
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
    return MyMatrix.multiplyMatrices(matrix, [
        1, 0, 0, 0,
        0, cosAngle, sinAngle, 0,
        0, -sinAngle, cosAngle, 0,
        0, 0, 0, 1
    ]);
}

// Create a function to rotate around the Y axis
function rotateY(matrix, angle) {
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
    return MyMatrix.multiplyMatrices(matrix, [
        cosAngle, 0, -sinAngle, 0,
        0, 1, 0, 0,
        sinAngle, 0, cosAngle, 0,
        0, 0, 0, 1
    ]);
}
function rotateZ(matrix, angle) {
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
    return MyMatrix.multiplyMatrices(matrix, [
        cosAngle, sinAngle, 0, 0,
        -sinAngle, cosAngle, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
