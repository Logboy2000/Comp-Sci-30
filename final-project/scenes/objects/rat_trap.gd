extends Enemy

func _update_movement(delta: float):
	velocity.x = move_toward(velocity.x, 0, 1)
