extends Node
var game_root: GameRoot
var player: Player
var room_manager: RoomManager
var main_tilemap_layer: TileMapLayer

var is_transitioning: bool = false
var allow_pausing: bool = true

func freeze_game(duration_seconds: float):
	get_tree().paused = true
	await get_tree().create_timer(duration_seconds).timeout
	get_tree().paused = false

	
func die():
	game_root.show_death_screen()
