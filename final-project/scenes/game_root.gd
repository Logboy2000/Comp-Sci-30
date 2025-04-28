class_name GameRoot extends Node2D
@onready var phantom_camera_2d: PhantomCamera2D = $PhantomCamera2D
@onready var death_screen: Control = $OverlayLayer/Control/DeathScreen

func _ready() -> void:
	Global.game_root = self
	phantom_camera_2d.teleport_position()

func _process(delta: float) -> void:
	if Global.is_transitioning:
		phantom_camera_2d.follow_mode = phantom_camera_2d.FollowMode.NONE
	else:
		phantom_camera_2d.follow_mode = phantom_camera_2d.FollowMode.SIMPLE

func show_death_screen():
	death_screen.show()
