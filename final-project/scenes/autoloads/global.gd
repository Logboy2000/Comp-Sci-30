extends Node

var player: Player
var room_manager: RoomManager
var main_tilemap_layer: TileMapLayer

var is_transitioning: bool = false

func freeze_game(duration_seconds: float):
	get_tree().paused = true
	await get_tree().create_timer(duration_seconds).timeout
	get_tree().paused = false

	
