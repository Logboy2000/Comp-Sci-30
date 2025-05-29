extends Node2D

@export var entrance_id: int = 0
@onready var sprite_2d: Sprite2D = $Sprite2D

func _ready() -> void:
	sprite_2d.visible = false
