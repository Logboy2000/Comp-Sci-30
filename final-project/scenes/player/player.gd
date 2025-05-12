class_name Player extends CharacterBody2D

# Nodes
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var forward_attack = $ForwardAttack
@onready var downward_attack = $DownwardAttack
@onready var upward_attack: Node2D = $UpwardAttack
@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var owie_box: Area2D = $OwieBox

# Audio
const SLASH_SOUND = preload("res://audio/slash.wav")
const CLASSIC_HURT = preload("res://audio/classic_hurt.mp3")

@export var max_health: int = 5
@export var invincibility_frames: int = 80
@export var knockback_force: Vector2 = Vector2(400.0, 250.0)
@export var knockback_freeze_time: float = 0.15


var current_health: int = 10

# Movement Variables
@export_group("Horizontal Movement")
@export var normal_top_speed := 100.0
@export var run_top_speed := 150.0
@export var accel := 100.0
@export var friction := 2000.0

@export_group("Vertical Movement")
@export var jump_velocity := -220.0
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
var vulnurable := true
var current_invincibility_frames := 0
var facing_dir := 1.0
var is_running := false
var is_dead := false

func _ready():
	current_health = max_health
	Global.player = self
	update_forward_attack_direction()

func _physics_process(delta):
	visible = !is_dead
	update_sprite_anim()
	if is_dead:
		return
	if Global.is_transitioning:
		velocity.x = facing_dir * normal_top_speed
		apply_gravity(delta)
		move_and_slide()
	else:
		if current_invincibility_frames > 0:
			current_invincibility_frames -= 1
			vulnurable = false
		else:
			vulnurable = true
		
		handle_input()
		apply_horizontal_movement(delta)
		apply_gravity(delta)
		handle_jump_logic(delta)
		update_facing_direction()
		handle_attack()
		handle_owie()
		move_and_slide()

func handle_input():
	input_dir.x = Input.get_axis("left", "right")
	is_running = Input.is_action_pressed("run")
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = jump_buffer_time
	if Input.is_action_just_pressed("owie"):
		owie(1)
	if Input.is_action_just_pressed("reverse_owie"):
		reverse_owie(1)
	if Input.is_action_just_pressed("die"):
		die()

func apply_horizontal_movement(delta):
	var target_speed = run_top_speed if is_running else normal_top_speed
	if input_dir.x != 0:
		# Accelerate smoothly toward running or walking speed
		velocity.x = move_toward(velocity.x, input_dir.x * target_speed, accel)
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

	if (is_on_floor() or coyote_timer > 0) and jump_buffer_timer > 0 and not is_jumping:
		velocity.y = jump_velocity
		is_jumping = true
		is_pogoing = false
		coyote_timer = 0
		jump_buffer_timer = 0

func update_facing_direction():
	if input_dir.x != 0:
		facing_dir = input_dir.x
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
		Audio.play_sound(SLASH_SOUND)
		match attack_direction:
			Vector2.UP:
				upward_attack.start_attack(attack_direction)
			Vector2.DOWN:
				downward_attack.start_attack(attack_direction)
			_:
				forward_attack.start_attack(attack_direction)

func handle_owie():
	if vulnurable:
		animation_player.play("RESET")
	else:
		animation_player.play("invulnerable")
	
	for body in owie_box.get_overlapping_bodies():
		if body is Enemy:
			owie(1, body.position)

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

func reverse_owie(amount: int = 1):
	current_health += amount
	if current_health > max_health:
		current_health = max_health
	Global.player_hp_bar.update_health_ui()

func owie(amount: int, damage_position: Vector2 = global_position):
	if not vulnurable:
		return
	
	is_attacking = false
	current_invincibility_frames = invincibility_frames
	current_health -= amount
	Global.player_hp_bar.update_health_ui()
	
	
	# Knockback based on player and damage position
	var knockback_dir = Vector2(
		sign(position.x - damage_position.x),
		sign(position.y - damage_position.y)
	)
	velocity = Vector2(
		knockback_dir.x * knockback_force.x,
		knockback_dir.y * knockback_force.y
	) 
	if current_health <= 0:
		die()
	
	Audio.play_sound(CLASSIC_HURT)
func die():
	is_dead = true
	Global.die()

func respawn():
	is_dead = false
	visible = true
	current_health = max_health
	Global.player_hp_bar.update_health_ui()
