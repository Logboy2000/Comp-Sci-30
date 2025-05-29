extends Enemy

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@export var acceleration: float = 100
@export var max_speed: float = 300
var direction = 1
var speed = 1000
var target: Player



# CAlLED BY PARENT CLASS
func _update_movement(delta: float):
	if target != null:
		var to_target = (target.global_position - global_position).normalized()
		var desired_velocity = to_target * max_speed
		# Smoothly approach desired velocity
		velocity = velocity.lerp(desired_velocity, acceleration * delta / max_speed)
	else:
		# Smoothly decelerate to stop
		velocity = velocity.move_toward(Vector2.ZERO, acceleration * delta)



# COnnECTED thru editor
func _on_area_2d_body_entered(body: Node2D) -> void:
	if body is Player:
		target = body
		print("player seen!")
