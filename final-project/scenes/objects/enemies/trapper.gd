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
	
	if do_fire:
		sprite.modulate = Color(0,1,0)
	else:
		sprite.modulate = Color(1,0,0)
	
	if not do_fire:
		return
	
	var new_trap: Enemy = trap_scene.instantiate()
	var player_distance = position - Global.player.position
	new_trap.velocity.x = -player_distance.x * 1.1
	new_trap.velocity.y = randf_range(-300, -350)
	new_trap.global_position = global_position
	new_trap.mark_killed_on_death = false
	add_sibling(new_trap)
