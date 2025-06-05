extends Enemy

func _update_movement(_delta: float):
	velocity.x = move_toward(velocity.x, 0, 1)
