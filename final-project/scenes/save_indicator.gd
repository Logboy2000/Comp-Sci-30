extends Control

@onready var animated_sprite_2d: AnimatedSprite2D = $AnimatedSprite2D

func play():
	animated_sprite_2d.visible = true
	animated_sprite_2d.play("default")
