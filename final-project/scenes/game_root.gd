class_name GameRoot extends Node2D
@onready var phantom_camera_2d: PhantomCamera2D = $PhantomCamera2D

func _ready() -> void:
	phantom_camera_2d.teleport_position()

func _process(delta: float) -> void:
	if Global.is_transitioning:
		phantom_camera_2d.follow_mode = phantom_camera_2d.FollowMode.NONE
	else:
		phantom_camera_2d.follow_mode = phantom_camera_2d.FollowMode.SIMPLE
