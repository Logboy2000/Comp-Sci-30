class_name RoomManager extends Node2D

@onready var current_room: Room
@onready var phantom_camera_2d: PhantomCamera2D = $"../PhantomCamera2D"
@onready var transition_manager: TransitionManager = $"../TransitionManager"

@export_file("*.tscn") var starting_room: String

func _ready() -> void:
	await get_tree().process_frame
	Global.room_manager = self
	change_room(starting_room, 0, false)

func change_room(scene_path: String, entrance_id: int = 0, use_transition: bool = true):
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
	
	call_deferred("_add_new_room", entrance_id)


func _add_new_room(ent_id: int):
	add_child(current_room)
	if current_room.has_method("go_to_entrance"):
		current_room.go_to_entrance(ent_id)
	Global.is_transitioning = false
	phantom_camera_2d.set_limit_target(current_room.main_tile_map_layer.get_path())
	phantom_camera_2d.teleport_position()
	transition_manager.fade_out()

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("reload"):
		get_tree().reload_current_scene()
