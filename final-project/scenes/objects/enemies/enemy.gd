class_name Enemy extends CharacterBody2D

@export var max_health = 30
@export var knockback_resistance = 0.5  # 0 = no resistance, 1 = full resistance
@export var invincibility_duration = 0.2  # Seconds of invincibility after being hit
@export var gravity = 980
@export var affected_by_gravity = false
@export var knockback_duration = 0.05  # How long knockback lasts
@export var contact_damage: int = 1

@export_group("Nodes")
@export var animated_sprite: AnimatedSprite2D
@export var collision_shape: CollisionShape2D
var enemy_id: String
var room_name: String

var current_health: int
var is_invincible = false
var facing_right = true
var is_knockback = false
var pre_knockback_velocity = Vector2.ZERO


func _ready():
	# Auto-assign room name using the current scene's name
	room_name = get_tree().current_scene.name

	# Auto-assign enemy ID if not already set in the editor
	if enemy_id == "":
		enemy_id = generate_unique_id()

	if Global.is_enemy_killed(room_name, enemy_id):
		queue_free()  # Enemy was already killed
	
	if animated_sprite:
		animated_sprite.play("default")
	current_health = max_health
	if affected_by_gravity:
		motion_mode = CharacterBody2D.MOTION_MODE_GROUNDED
	else:
		motion_mode = CharacterBody2D.MOTION_MODE_FLOATING

func generate_unique_id() -> String:
	# Use the scene path + node name (or position) to ensure uniqueness
	return "%s_%s" % [room_name, name]

func _physics_process(delta: float) -> void:
	if affected_by_gravity:
		if not is_on_floor():
			velocity.y += gravity * delta
	
	# If not in knockback, update velocity based on enemy behavior
	
	if velocity.x > 0:
		animated_sprite.flip_h = false
	if velocity.x < 0:
		animated_sprite.flip_h = true
	
	if not is_knockback:
		_update_movement(delta)
	
	move_and_slide()

func _update_movement(_delta: float):
	# Override this in child classes to implement specific movement patterns
	pass

func take_damage(amount: int, knockback_direction: Vector2 = Vector2.ZERO, knockback_force: float = 0.0):
	if is_invincible:
		return
		
	current_health -= amount
	
	# Apply knockback if any
	if knockback_force > 0:
		is_knockback = true
		pre_knockback_velocity = velocity
		velocity = knockback_direction * knockback_force * (1.0 - knockback_resistance)
		start_knockback_timer()
	
	# Start invincibility
	is_invincible = true
	start_invincibility_timer()
	
	# Handle death
	if current_health <= 0:
		die()
	else:
		# Play hit animation or effect
		on_hit()

func start_knockback_timer():
	await get_tree().create_timer(knockback_duration).timeout
	is_knockback = false
	velocity = pre_knockback_velocity

func die():
	# Override this in child classes for death effects
	Global.mark_enemy_killed(room_name,enemy_id)
	queue_free()

func on_hit():
	# Override this in child classes for hit effects
	pass

func start_invincibility_timer():
	await get_tree().create_timer(invincibility_duration).timeout
	is_invincible = false

func update_facing_direction(direction: float):
	if direction != 0:
		facing_right = direction > 0
		scale.x = 1 if facing_right else -1
