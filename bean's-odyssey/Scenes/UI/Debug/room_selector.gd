extends Control

@onready var button_container: VBoxContainer = $MarginContainer/VBoxContainer/ScrollContainer/VBoxContainer

var room_dir: String = "res://Scenes/Rooms/"
var room_list: Array = []  # Stores room names (without full paths)

func _ready() -> void:
	if OS.has_feature("editor"):  # Only runs in editor mode
		var dir = DirAccess.open(room_dir)
		if dir:
			dir.list_dir_begin()
			var file_name = dir.get_next()
			while file_name != "":
				if not dir.current_is_dir() and file_name.get_extension() == "tscn":
					var room_name = file_name.get_basename()  # Get file name without extension
					room_list.append(room_name)
				file_name = dir.get_next()
			dir.list_dir_end()
		else:
			printerr("An error occurred when trying to access room list.")

	if room_list.is_empty():
		printerr("No rooms found. Check the directory path or ensure rooms exist.")
		return

	# Print out each room name for debugging
	print_rich("[color=#49cc6c][b]ROOM LIST:[/b][/color]")
	for room in room_list:
		print_rich('[color=#49cc6c]"', room, '"', ",[/color]")

	# Create buttons for each room
	for room_index in range(room_list.size()):
		var new_button = Button.new()
		new_button.text = room_list[room_index]  # Display room name only
		new_button.connect("pressed", Callable(self, "_on_button_pressed").bind(room_index))
		button_container.add_child(new_button)

func _on_button_pressed(room_index: int) -> void:
	visible = false  # Hide UI when a room is selected
	if room_index >= 0 and room_index < room_list.size():
		Global.transition_layer.change_room(room_list[room_index])  # Use room name instead of full path
