extends CharacterBody2D

#nodes
@onready var sword = $Sword

# movement variables
@export var speed = 100.0
@export var jump_velocity = -400.0
@export var gravity = 980.0
@export var friction = 2000.0

var gravity_multiplier = 1.0
var is_jumping = false
var facing_right = true

func _ready():
	# Make sure sword is properly oriented
	update_sword_direction()

func _physics_process(delta):
	# Add gravity
	if not is_on_floor():
		velocity.y += gravity * gravity_multiplier * delta
		# Apply jump cut gravity when jump button is released
		if is_jumping and not Input.is_action_pressed("jump"):
			# Make the player start falling immediately
			if velocity.y < 0:  # Only if moving upward
				velocity.y = 0
	else:
		gravity_multiplier = 1.0
		is_jumping = false
	
	# Handle jump
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = jump_velocity
		is_jumping = true
	
	# Get input direction
	var direction = Input.get_axis("move_left", "move_right")
	
	# Update facing direction
	if direction != 0:
		facing_right = direction > 0
		update_sword_direction()
	
	# Apply movement
	if direction:
		# Set speed directly
		velocity.x = direction * speed
	else:
		# Apply friction to slow down
		velocity.x = move_toward(velocity.x, 0, friction * delta)
	
	# Handle attack
	if Input.is_action_just_pressed("attack"):
		sword.start_attack()
	
	# Move the character
	move_and_slide()

func update_sword_direction():
	# Flip sword based on facing direction
	if facing_right: sword.scale.x = 1 
	else: sword.scale.x = -1
