extends Enemy

@export var trap_scene: PackedScene

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var detection_area: Area2D = $DetectionArea


func _on_trap_timer_timeout() -> void:
	pass
