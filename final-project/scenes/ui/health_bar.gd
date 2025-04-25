extends HBoxContainer

@export var full_icon: Texture
@export var empty_icon: Texture

func _ready():
	await get_tree().process_frame
	setup_health_icons()
	update_health_ui()

func setup_health_icons():
	# Clear any existing icons
	for child in get_children():
		remove_child(child)
		child.queue_free()

	# Create icons based on max_health
	for i in range(Global.player.max_health):
		# Container for stacking icons
		var icon_container = Control.new()
		icon_container.custom_minimum_size = Vector2(28,24)
		icon_container.size_flags_horizontal = Control.SIZE_SHRINK_CENTER

		# Empty icon (bottom)
		var empty_tex = TextureRect.new()
		empty_tex.texture = empty_icon
		empty_tex.custom_minimum_size = Vector2(28,24)
		empty_tex.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		empty_tex.anchor_right = 1.0
		empty_tex.anchor_bottom = 1.0
		empty_tex.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		icon_container.add_child(empty_tex)

		# Full icon (top)
		var full_tex = TextureRect.new()
		full_tex.texture = full_icon
		full_tex.custom_minimum_size = Vector2(28,24)
		full_tex.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		full_tex.anchor_right = 1.0
		full_tex.anchor_bottom = 1.0
		full_tex.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		icon_container.add_child(full_tex)

		add_child(icon_container)

func update_health_ui():
	for i in range(get_child_count()):
		var icon_container = get_child(i)
		var full_tex = icon_container.get_child(1)
		if i < Global.player.current_health:
			full_tex.visible = true
		else:
			full_tex.visible = false
