class_name Interactable extends Node2D
@onready var sprite_2d: Sprite2D = $Sprite2D
@onready var area_2d: Area2D = $Area2D
@onready var label: Label = $Label
func _process(_delta: float) -> void:
	if label.visible and Input.is_action_just_pressed("up"):
		if has_method("_interact"):
			_interact()


func _on_area_2d_body_entered(body: Node2D) -> void:
	if body.is_in_group("player"):
		label.show()


func _on_area_2d_body_exited(body: Node2D) -> void:
	if body.is_in_group("player"):
		label.hide()

func _interact() -> void:
	# Optional: Warn if not overridden
	print_debug("Warning: _interact() called on base Interactable. Override this in a child class.")
