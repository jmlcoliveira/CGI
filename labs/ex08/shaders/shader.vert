uniform float uDx, uDy;
attribute vec4 vPosition;

void main()
{
    //gl_Position = vPosition + vec4(uDx, 0.0, 0.0, 0.0);
    gl_Position = vPosition;
    gl_Position.x += uDx;
    gl_Position.y += uDy;
}