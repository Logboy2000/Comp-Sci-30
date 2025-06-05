class_name SavePoint extends Node2D
@onready var sprite_2d: Sprite2D = $Sprite2D
@onready var area_2d: Area2D = $Area2D
@onready var label: Label = $Label
@export var entrance_id: int = 0
func _process(delta: float) -> void:
	sprite_2d.rotate(10 * delta)
	
	if label.visible:
		if Input.is_action_just_pressed("up"):
			Global.save_game(self)


func _on_area_2d_body_entered(body: Node2D) -> void:
	if body.is_in_group("player"):
		label.show()


func _on_area_2d_body_exited(body: Node2D) -> void:
	if body.is_in_group("player"):
		label.hide()
