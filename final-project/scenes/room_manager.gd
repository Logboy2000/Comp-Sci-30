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
	change_room(starting_room, 0, false)

func change_room(scene_path: String, entrance_id: int = 0, use_transition: bool = true):
	if Global.is_transitioning:
		return
	
	Global.is_transitioning = true
	if use_transition:
		await transition_manager.fade_in()
	
	if current_room:
		current_room.queue_free()  # Remove the current room
	
	var new_room_scene = load(scene_path)
	if not new_room_scene:
		push_error("Failed to load room scene at: " + scene_path)
		Global.is_transitioning = false
		return
	
	
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
	Global.is_transitioning = false
	new_room_loaded.emit()
	transition_manager.fade_out()
	
func reload_current_room(entrance_id: int = 0, use_transition: bool = true):
	change_room(current_scene_path, entrance_id, use_transition)
func _input(event: InputEvent) -> void:
	if event.is_action_pressed("reload"):
		change_room(current_scene_path, current_entrance)
