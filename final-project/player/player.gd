extends CharacterBody2D

#nodes
@onready var forward_attack = $ForwardAttack
@onready var downward_attack = $DownwardAttack
@onready var upward_attack: Node2D = $UpwardAttack

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

# movement variables
@export_category("Horizontal Movement")
@export var normal_top_speed = 100.0
@export var run_top_speed = 150.0
@export var accel = 100.0
@export var friction = 2000.0

@export_category("Vertical Movement")
@export var jump_velocity = -200.0
@export var pogo_velocity = -250.0
@export var gravity = 980.0
@export var coyote_time = 0.15
@export var jump_buffer_time = 0.1  
@export var cap_fall_speed: bool = true
@export var max_fall_speed = 300.0

var gravity_multiplier = 1.0
var is_jumping = false
var facing_right = true
var coyote_timer = 0.0
var jump_buffer_timer = 0.0
var was_on_floor = false
var attack_direction = Vector2.RIGHT 
var is_attacking = false

func _ready():
	# Make sure forward_attack is properly oriented
	update_forward_attack_direction()

func _physics_process(delta):
	# Get input direction
	var direction = Input.get_axis("left", "right")
	
	
	#if Input.is_action_pressed("run"):
		#pass
	
	if direction != 0 and is_on_floor():
		sprite.play("default")
	else:
		sprite.play("idle")
	
	
	if direction != 0 and abs(velocity.x) < normal_top_speed:
		# Set speed directly
		velocity.x += direction * accel
	else:
		# Apply friction to slow down
		velocity.x = move_toward(velocity.x, 0, friction * delta)
	
	# Add gravity
	if not is_on_floor():
		if cap_fall_speed:
			velocity.y = min(max_fall_speed, velocity.y)
		
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
	
	
	# Update facing direction
	if direction != 0:
		facing_right = direction > 0
		sprite.flip_h = !facing_right
	
	
	
	# Update attack direction based on input
	if not is_attacking:
		if Input.is_action_pressed("up"):
			attack_direction = Vector2.UP
		elif Input.is_action_pressed("down") and not is_on_floor():
			attack_direction = Vector2.DOWN
		else:
			attack_direction = Vector2.RIGHT if facing_right else Vector2.LEFT
			update_forward_attack_direction()
		
		# Handle attack
		if Input.is_action_just_pressed("attack"):
			is_attacking = true
			if attack_direction == Vector2.UP:
				upward_attack.start_attack(attack_direction)
			elif attack_direction == Vector2.DOWN:
				downward_attack.start_attack(attack_direction)
			else:
				forward_attack.start_attack(attack_direction)
	
	
	move_and_slide()


func update_forward_attack_direction():
	# Update forward_attack position and rotation based on attack direction
		if facing_right:
			forward_attack.scale.x = 1
		else:
			forward_attack.scale.x = -1

func _on_attack_finished():
	is_attacking = false

	


func pogo():
	if is_on_floor():
		return
	is_jumping = false
	velocity.y = pogo_velocity
