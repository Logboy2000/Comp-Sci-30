extends CharacterBody2D

#nodes
@onready var sword = $Sword

# movement variables
@export var speed = 100.0
@export var jump_velocity = -400.0
@export var gravity = 980.0
@export var friction = 2000.0
@export var coyote_time = 0.15
@export var jump_buffer_time = 0.1  
@export var pogo_velocity = -300.0
@export var cap_fall_speed: bool = true

var gravity_multiplier = 1.0
var is_jumping = false
var facing_right = true
var coyote_timer = 0.0
var jump_buffer_timer = 0.0
var was_on_floor = false
var attack_direction = Vector2.RIGHT 
var is_attacking = false

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
	
	# Handle coyote time
	if was_on_floor and not is_on_floor():
		coyote_timer = coyote_time
	was_on_floor = is_on_floor()
	
	# Update timers
	if coyote_timer > 0:
		coyote_timer -= delta
	if jump_buffer_timer > 0:
		jump_buffer_timer -= delta
	
	# Handle jump input buffering
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = jump_buffer_time
	
	# Handle jump
	if (is_on_floor() or coyote_timer > 0) and jump_buffer_timer > 0:
		velocity.y = jump_velocity
		is_jumping = true
		coyote_timer = 0
		jump_buffer_timer = 0
	
	# Get input direction
	var direction = Input.get_axis("left", "right")
	
	# Update facing direction
	if direction != 0:
		facing_right = direction > 0
	
	update_sword_direction()
	
	# Only update attack direction if not currently attacking
	if not is_attacking:
		# Update attack direction based on input
		var attack_input = Vector2.ZERO
		
		# Check for most recent direction pressed
		if Input.is_action_pressed("up"):
			attack_input = Vector2.UP
		elif Input.is_action_pressed("down") and not is_on_floor():
			attack_input = Vector2.DOWN
		else:
			if facing_right:
				attack_input = Vector2.RIGHT
			else:
				attack_input = Vector2.LEFT
		
		# If there's attack input, update direction
		if attack_input != Vector2.ZERO:
			attack_direction = attack_input
			update_sword_direction()
	
	# Handle attack
	if Input.is_action_just_pressed("attack"):
		is_attacking = true
		sword.start_attack(attack_direction)
	
	# Apply movement
	if direction and abs(velocity.x) < speed:
		# Set speed directly
		velocity.x += direction * speed
	else:
		# Apply friction to slow down
		velocity.x = move_toward(velocity.x, 0, friction * delta)
	
	# Move the character
	move_and_slide()

func update_sword_direction():
	# Update sword position and rotation based on attack direction
	if attack_direction == Vector2.ZERO:
		# If no attack direction, use movement direction
		sword.scale.x = 1 if facing_right else -1
		sword.rotation = 0
	else:
		# Set sword rotation based on attack direction
		sword.rotation = attack_direction.angle()
		# Flip sword if needed to maintain proper orientation
		sword.scale.x = 1

func _on_sword_attack_finished():
	is_attacking = false

func pogo():
	is_jumping = false
	velocity.y = pogo_velocity
