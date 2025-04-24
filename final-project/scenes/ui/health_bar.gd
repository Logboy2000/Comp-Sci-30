extends HBoxContainer

@export var full_icon: Texture
@export var empty_icon: Texture
@export var max_health: int = 10
var current_health: int = 10

func _ready():
	setup_health_icons()
	update_health_ui()

func setup_health_icons():
	# Clear any existing icons
	for child in get_children():
		remove_child(child)
		child.queue_free()

	# Create icons based on max_health
	for i in range(max_health):
		var icon = TextureRect.new()
		icon.texture = full_icon
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		add_child(icon)

func update_health_ui():
	for i in range(get_child_count()):
		var icon = get_child(i) as TextureRect
		if i < current_health:
			icon.texture = full_icon
		else:
			icon.texture = empty_icon

func set_health(value: int):
	current_health = clamp(value, 0, max_health)
	update_health_ui()
