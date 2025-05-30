extends Enemy

@export var trap_scene: PackedScene

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var detection_area: Area2D = $DetectionArea


func _on_trap_timer_timeout() -> void:
	print("trap")
	var new_trap := trap_scene.instantiate()
	var player_distance = position - Global.player.position
	new_trap.linear_velocity.x = -player_distance.x
	new_trap.linear_velocity.y = randf_range(-400,-500)
	new_trap.global_position = global_position
	add_sibling(new_trap)
