extends VideoStreamPlayer

func _process(delta: float) -> void:
	rotation_degrees += delta * 30
