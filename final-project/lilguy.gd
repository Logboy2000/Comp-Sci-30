extends Enemy

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var direction = 1  # 1 for right, -1 for left
var speed = 1000


func update_movement(delta: float):
	velocity.x = direction * speed * delta
	move_and_slide()


func _on_timer_timeout() -> void:
	direction *= -1
