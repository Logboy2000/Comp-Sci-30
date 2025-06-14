class_name GameRoot extends Node2D
@onready var phantom_camera_2d: PhantomCamera2D = $PhantomCamera2D
@onready var death_screen: Control = $OverlayLayer/Control/DeathScreen
@onready var player: Player = $Player
@onready var room_manager: RoomManager = $RoomManager
@onready var death_screen_animation_player: AnimationPlayer = $OverlayLayer/Control/DeathScreen/DeathScreenAnimationPlayer
@onready var save_indicator: Control = $OverlayLayer/Control/SaveIndicator

func _ready() -> void:
	Global.game_root = self
	phantom_camera_2d.teleport_position()

func show_death_screen():
	death_screen_animation_player.play("fade")
	death_screen.show()

func _on_respawn_pressed() -> void:
	Global.room_manager.return_to_save_point()


func _on_room_manager_new_room_loaded() -> void:
	if player.is_dead:
		death_screen.hide()
		player.respawn()
