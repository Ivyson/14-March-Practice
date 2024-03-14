precision mediump float;
attribute vec3 vecposition;
uniform mat4 rotateX;
uniform mat4 rotateZ;
uniform mat4 rotateY;
uniform mat4 Translate;
void main() {
    gl_Position = Translate*vec4(vecposition, 1.0);
}