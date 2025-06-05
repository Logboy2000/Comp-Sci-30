extends Node

const FLASHBANG = preload("res://audio/flashbang.mp3")

var game_root: GameRoot
var player: Player
var room_manager: RoomManager
var main_tilemap_layer: TileMapLayer
var player_hp_bar: HBoxContainer

var is_transitioning: bool = false
var allow_pausing: bool = true

var can_respawn_enemies: bool = true

var rat_mode: bool = false

func freeze_game(duration_seconds: float):
	get_tree().paused = true
	await get_tree().create_timer(duration_seconds).timeout
	get_tree().paused = false
	
func die():
	Audio.play_sound(FLASHBANG)
	reset_killed_enemies()
	game_root.show_death_screen()


var killed_enemies := {}  # You don’t need to pre-fill this manually.

func mark_enemy_killed(room_name: String, enemy_id: String):
	if not killed_enemies.has(room_name):
		killed_enemies[room_name] = []
	killed_enemies[room_name].append(enemy_id)

func is_enemy_killed(room_name: String, enemy_id: String) -> bool:
	return killed_enemies.get(room_name, []).has(enemy_id)

func reset_killed_enemies():
	killed_enemies = {}
	
func _input(event: InputEvent) -> void:
	if event.is_action_pressed("respawn_enemies"):
		reset_killed_enemies()

func save_game(save_point: SavePoint):
	SettingsManager.set_setting("has_roll", player.canRoll)
	SettingsManager.set_setting("save_room", room_manager.current_scene_path)
	SettingsManager.set_setting("save_entrance_id", save_point.entrance_id)
	print("game saved!")
