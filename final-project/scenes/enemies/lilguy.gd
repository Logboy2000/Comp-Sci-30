extends Enemy

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var direction = 1
var speed = 1000


func _update_movement(delta: float):
	velocity.x = direction * speed * delta


func _on_timer_timeout() -> void:
	direction *= -1
