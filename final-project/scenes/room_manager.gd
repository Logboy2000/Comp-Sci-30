class_name RoomManager extends Node2D

@onready var current_room: Room
@onready var phantom_camera_2d: PhantomCamera2D = $"../PhantomCamera2D"
@onready var transition_manager: TransitionManager = $"../OverlayLayer/Control/TransitionManager"
@export_file("*.tscn") var starting_room: String

signal new_room_loaded
var current_scene_path := ""
var current_entrance := 0

func _ready() -> void:
	await get_tree().process_frame
	Global.room_manager = self
	return_to_save_point(false)


func return_to_save_point(use_transition: bool = true):
	var save_room = SettingsManager.get_setting("save_room")
	var save_entrance_id = SettingsManager.get_setting("save_entrance_id")
	if save_room == "":
		change_room(starting_room, 0, use_transition)
	else:
		change_room(save_room, save_entrance_id, use_transition)

func change_room(scene_path: String, entrance_id: int = 0, use_transition: bool = true):
	if Global.is_transitioning:
		return
	
	Global.is_transitioning = true
	if use_transition:
		await transition_manager.fade_in()
	

	
	var new_room_scene = load(scene_path)
	if not new_room_scene:
		push_error("Failed to load room scene at: " + scene_path)
		Global.is_transitioning = false
		return
	
	if current_room:
		current_room.queue_free()  # Remove the current room
	
	current_room = new_room_scene.instantiate()
	current_scene_path = scene_path
	current_entrance = entrance_id
	
	call_deferred("_add_new_room")



func _add_new_room():
	add_child(current_room)
	if current_room.has_method("go_to_entrance"):
		current_room.go_to_entrance(current_entrance)
	phantom_camera_2d.set_limit_target(current_room.camera_bounds.get_path())
	phantom_camera_2d.teleport_position()
	new_room_loaded.emit()
	await transition_manager.fade_out()
	Global.is_transitioning = false
	
func reload_current_room(entrance_id: int = 0, use_transition: bool = true):
	change_room(current_scene_path, entrance_id, use_transition)
func _input(event: InputEvent) -> void:
	if event.is_action_pressed("reload"):
		change_room(current_scene_path, current_entrance)
