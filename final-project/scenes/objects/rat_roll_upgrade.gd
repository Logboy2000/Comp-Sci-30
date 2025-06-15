extends Interactable

func _ready() -> void:
	if Global.player.has_roll:
		queue_free()

func _interact() -> void:
	Global.player.has_roll = true
	queue_free()
