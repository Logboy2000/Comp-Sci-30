class_name GameRoot extends Node2D
@onready var phantom_camera_2d: PhantomCamera2D = $PhantomCamera2D

func _ready() -> void:
	phantom_camera_2d.teleport_position()
