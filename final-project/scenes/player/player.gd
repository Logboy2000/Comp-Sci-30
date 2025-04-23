extends CharacterBody2D

# Nodes
@onready var forward_attack = $ForwardAttack
@onready var downward_attack = $DownwardAttack
@onready var upward_attack: Node2D = $UpwardAttack
@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

# Movement Variables
@export_category("Horizontal Movement")
@export var normal_top_speed := 100.0
@export var run_top_speed := 150.0
@export var accel := 100.0
@export var friction := 2000.0

@export_category("Vertical Movement")
@export var jump_velocity := -200.0
@export var pogo_velocity := -250.0
@export var gravity := 980.0
@export var coyote_time := 0.15
@export var jump_buffer_time := 0.1
@export var cap_fall_speed := true
@export var max_fall_speed := 300.0

# State Variables
var gravity_multiplier := 1.0
var is_jumping := false
var is_pogoing := false
var facing_right := true
var coyote_timer := 0.0
var jump_buffer_timer := 0.0
var was_on_floor := false
var is_attacking := false
var attack_direction := Vector2.RIGHT
var input_dir := Vector2.ZERO

func _ready():
	update_forward_attack_direction()

func _physics_process(delta):
	handle_input()
	apply_horizontal_movement(delta)
	apply_gravity(delta)
	handle_jump_logic(delta)
	update_facing_direction()
	handle_attack()
	move_and_slide()
	update_sprite_anim()

func handle_input():
	input_dir.x = Input.get_axis("left", "right")
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = jump_buffer_time

func apply_horizontal_movement(delta):
	if input_dir.x != 0 and abs(velocity.x) < normal_top_speed:
		velocity.x += input_dir.x * accel
	else:
		velocity.x = move_toward(velocity.x, 0, friction * delta)

func apply_gravity(delta):
	if not is_on_floor():
		if cap_fall_speed:
			velocity.y = min(velocity.y, max_fall_speed)
		velocity.y += gravity * gravity_multiplier * delta

		if is_jumping and not Input.is_action_pressed("jump") and velocity.y < 0:
			velocity.y = 0
	else:
		gravity_multiplier = 1.0
		is_jumping = false
		is_pogoing = false

func handle_jump_logic(delta):
	if was_on_floor and not is_on_floor():
		coyote_timer = coyote_time
	was_on_floor = is_on_floor()

	if coyote_timer > 0:
		coyote_timer -= delta
	if jump_buffer_timer > 0:
		jump_buffer_timer -= delta

	if (is_on_floor() or coyote_timer > 0) and jump_buffer_timer > 0:
		velocity.y = jump_velocity
		is_jumping = true
		is_pogoing = false
		coyote_timer = 0
		jump_buffer_timer = 0

func update_facing_direction():
	if input_dir.x != 0:
		facing_right = input_dir.x > 0
		sprite.flip_h = !facing_right

func handle_attack():
	if is_attacking:
		return

	if Input.is_action_pressed("up"):
		attack_direction = Vector2.UP
	elif Input.is_action_pressed("down") and not is_on_floor():
		attack_direction = Vector2.DOWN
	else:
		attack_direction = Vector2.RIGHT if facing_right else Vector2.LEFT
		update_forward_attack_direction()

	if Input.is_action_just_pressed("attack"):
		is_attacking = true
		match attack_direction:
			Vector2.UP:
				
				upward_attack.start_attack(attack_direction)
			Vector2.DOWN:
				downward_attack.start_attack(attack_direction)
			_:
				forward_attack.start_attack(attack_direction)

func update_sprite_anim():
	var new_animation: StringName = "idle"
	sprite.speed_scale = 1

	if is_pogoing:
		new_animation = "spin"
	elif velocity.y > 0:
		new_animation = "fall"
	elif is_jumping:
		new_animation = "jump"
	elif input_dir.x != 0 and is_on_floor():
		new_animation = "walk"

	if sprite.animation != new_animation:
		sprite.play(new_animation)

func update_forward_attack_direction():
	forward_attack.scale.x = 1 if facing_right else -1

func _on_attack_finished():
	is_attacking = false

func pogo():
	if is_on_floor():
		return
	is_pogoing = true
	is_jumping = false
	velocity.y = pogo_velocity
	sprite.stop()
	sprite.play("spin")
