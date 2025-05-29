extends Enemy

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

@onready var ray_cast_rd: RayCast2D = $RayCastRD
@onready var ray_cast_rr: RayCast2D = $RayCastRR
@onready var ray_cast_ld: RayCast2D = $RayCastLD
@onready var ray_cast_ll: RayCast2D = $RayCastLL

var direction = 1
@export var speed = 1000


func _update_movement(_delta: float):
	if not ray_cast_ld.is_colliding() or ray_cast_ll.is_colliding():
		direction = 1
	if not ray_cast_rd.is_colliding() or ray_cast_rr.is_colliding():
		direction = -1
	velocity.x = direction * speed
