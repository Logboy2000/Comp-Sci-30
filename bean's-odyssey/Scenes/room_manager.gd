class_name RoomManager extends Node

const DEFAULT_ROOM := "load_failed_room"
const MAX_CACHE_SIZE := 10  # Limit the number of cached rooms

var current_room: Node2D
var current_room_name: String
var room_cache := {}  # Dictionary: {room_name: PackedScene}
var cache_order := []  # Stores room names in the order they were added

signal room_changed(new_room_name: String)

func _ready() -> void:
	Global.room_manager = self

func unload_current_room():
	if current_room:
		current_room.queue_free()
		current_room = null

func load_room(room_name: String):
	
	var room_path = "res://Scenes/Rooms/" + room_name + ".tscn"

	# Check if room exists
	if not FileAccess.file_exists(room_path):
		room_name = DEFAULT_ROOM
		room_path = "res://Scenes/Rooms/" + room_name + ".tscn"
		push_warning("Room does not exist! Loading default room.")

	unload_current_room()

	# Load from cache if available
	var room_scene: PackedScene
	if room_name in room_cache:
		room_scene = room_cache[room_name]
	else:
		room_scene = load(room_path)
		_add_to_cache(room_name, room_scene)
	
	current_room = room_scene.instantiate()
	current_room_name = room_name
	add_child(current_room)
	
	emit_signal("room_changed", current_room_name)

func _add_to_cache(room_name: String, room_scene: PackedScene):
	if room_name in room_cache:
		return  # Avoid duplicates

	# Add new room to cache
	room_cache[room_name] = room_scene
	cache_order.append(room_name)

	# If cache exceeds max size, remove the oldest cached room
	if cache_order.size() > MAX_CACHE_SIZE:
		var oldest_room = cache_order.pop_front()
		room_cache.erase(oldest_room)  # Free up memory

func reload_current_room():
	load_room(current_room_name)
