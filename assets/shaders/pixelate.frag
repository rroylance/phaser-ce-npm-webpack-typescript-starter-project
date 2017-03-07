precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
    vec2 dimensions = vec2(1000.0, 10000.0);
    vec2 pixelSize = vec2(3.0, 3.0);
    vec2 coord = vTextureCoord;
    vec2 size = dimensions.xy/pixelSize;
    vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;
    gl_FragColor = texture2D(uSampler, color);
}
