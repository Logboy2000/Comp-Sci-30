extends CharacterBody2D

# Player movement variables
@export var speed = 300.0
@export var jump_velocity = -400.0
@export var gravity = 980.0
@export var acceleration = 2000.0
@export var friction = 2000.0

# Get the gravity from the project settings to be synced with RigidBody nodes
var gravity_multiplier = 1.0

func _physics_process(delta):
	# Add gravity
	if not is_on_floor():
		velocity.y += gravity * gravity_multiplier * delta
	
	# Handle jump
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = jump_velocity
	
	# Get input direction
	var direction = Input.get_axis("move_left", "move_right")
	
	# Apply movement with acceleration and friction
	if direction:
		velocity.x = move_toward(velocity.x, direction * speed, acceleration * delta)
	else:
		velocity.x = move_toward(velocity.x, 0, friction * delta)
	
	# Move the character
	move_and_slide()
