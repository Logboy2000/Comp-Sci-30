extends CharacterBody2D

@export var jump_velocity: float = -100.0 # Initial jump speed (magnitude)
@export var gravity: float = 160.0

@export var acceleration: float = 120.0
@export var deceleration: float = 50.0
@export var max_velocity: float = 180.0
@export var move_speed_multiplier: float = 1.0

var input_dir: Vector2 = Vector2.ZERO


func _physics_process(delta: float) -> void:
	input_dir = Input.get_vector("left", "right", "up", "down")

	# L/R Movement
	if (abs(velocity.x) > max_velocity and sign(velocity.x) == input_dir.x):
		#Reduce back from beyond the max speed
		velocity.x = move_toward(velocity.x, max_velocity * input_dir.x, deceleration * move_speed_multiplier * delta)
	else:
		#Approach the max speed
		velocity.x = move_toward(velocity.x, max_velocity * input_dir.x, acceleration * move_speed_multiplier * delta)


	# Apply gravity
	if not is_on_floor():
		velocity.y += gravity * delta

	# Auto-jump when touching the ground (no manual jump)
	if is_on_floor() and velocity.y <= 0:
		jump()

	move_and_slide()

func jump():
	# Get the floor normal
	var normal = get_floor_normal()

	# If on flat ground, jump straight up
	if normal == Vector2.UP:
		velocity.y = jump_velocity
	else:
		# Calculate the jump direction based on the slope's normal
		var jump_direction = normal.rotated(PI / 2) # Rotate 90 degrees to get a tangent vector.  This becomes our jump direction

		# Preserve Jump Energy (Magnitude of jump_velocity)
		velocity.x = -jump_direction.x * jump_velocity
		velocity.y = jump_direction.y * jump_velocity
