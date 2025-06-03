extends Enemy

@export var trap_scene: PackedScene

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var detection_area: Area2D = $DetectionArea

var do_fire: bool = false

func _on_trap_timer_timeout() -> void:
	do_fire = false
	for body in detection_area.get_overlapping_bodies():
		if body.is_in_group("player"):
			do_fire = true
	
	if not do_fire:
		return
	
	var new_trap := trap_scene.instantiate()
	var player_distance = position - Global.player.position
	new_trap.linear_velocity.x = -player_distance.x
	new_trap.linear_velocity.y = randf_range(-400,-500)
	new_trap.global_position = global_position
	add_sibling(new_trap)
