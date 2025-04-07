extends Node2D

func _ready() -> void:
	# Connect first
	Global.room_manager.connect("room_changed", Callable(self, "_on_room_changed"))
	Global.game = self
	
	Global.room_manager.load_room("test_room")

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("reload_room"):
		Global.room_manager.reload_current_room()
	if event.is_action_pressed("exit_game"):
		exit(0)


func exit(code: int = 0):
	get_tree().quit(code)

func _on_update_debug_timeout() -> void:
	Global.debug_menu.modify_label("fps", "FPS: " + str(Engine.get_frames_per_second()))

func _on_room_changed(new_room_name: String):
	Global.debug_menu.modify_label("room", "Room: " + new_room_name)
