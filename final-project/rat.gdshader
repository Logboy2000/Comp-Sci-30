shader_type canvas_item;

uniform sampler2D screen_texture : hint_screen_texture;
uniform float blur_radius = 1.0;

void fragment() {
    vec2 uv = SCREEN_UV;
    vec4 sum = vec4(0.0);
    float count = 0.0;

    // Apply a simple blur by averaging neighboring pixels
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 offset = vec2(float(x), float(y)) * blur_radius * SCREEN_PIXEL_SIZE;
            sum += texture(screen_texture, uv + offset);
            count += 1.0;
        }
    }

    vec4 color = sum / count;
    vec3 rgb = color.rgb;

    // Desaturate the color
    float gray = dot(rgb, vec3(0.3, 0.59, 0.11));

    // Reduce red channel to simulate red-blindness
    rgb.r = gray * 0.5;
    rgb.g = gray;
    rgb.b = gray * 0.8;

    COLOR = vec4(rgb, color.a);
}
