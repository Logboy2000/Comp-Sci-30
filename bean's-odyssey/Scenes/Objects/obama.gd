extends Sprite2D

var change = randf_range(-100, 100)

func _process(delta: float) -> void:
	rotation_degrees += change * delta
