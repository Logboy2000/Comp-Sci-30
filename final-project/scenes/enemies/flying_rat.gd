extends Enemy

var target: Player = null
var start_pos: Vector2 = Vector2.ZERO
const MAX_DISTANCE: float = 100.0

func _ready() -> void:
	super._ready()
	start_pos = global_position

func _update_movement(delta: float) -> void:
	if target:
		# Follow target
		var direction = (target.global_position - global_position).normalized()
		velocity = direction * move_speed
	else:
		var distance_from_start = global_position.distance_to(start_pos)
		if distance_from_start > MAX_DISTANCE:
			# Move back to start position
			var return_dir = (start_pos - global_position).normalized()
			velocity = return_dir * move_speed
		else:
			# Idle: stop movement
			velocity = Vector2.ZERO

func _on_area_2d_body_entered(body: Node2D) -> void:
	if body is Player:
		target = body
