shader_type canvas_item;

uniform sampler2D screen_texture : hint_screen_texture;

void fragment() {
    vec4 color = texture(screen_texture, SCREEN_UV);
    COLOR = vec4(1.0 - color.rgb, color.a);
}
