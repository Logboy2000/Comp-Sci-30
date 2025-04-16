extends Node2D

signal attack_finished

@onready var sprite: Polygon2D = $Sprite
@onready var hitbox: Area2D = $Hitbox

@export var damage = 5.0
@export var attack_cooldown = 0.1
@export var attack_duration = 0.2
@export var wall_knockback_force = 250.0
@export var enemy_knockback = 500.0

enum AttackState {
	IDLE,
	ACTIVE,
	RECOVERY
}

var current_state = AttackState.IDLE
var attack_timer = 0.0
var can_attack = true
var hit_enemies = []
var current_attack_direction = Vector2.RIGHT
var player: CharacterBody2D
var has_applied_knockback = false

func _ready():
	hitbox.monitoring = false
	hitbox.monitorable = false
	player = get_parent()

func _process(delta):
	match current_state:
		AttackState.ACTIVE:
			attack_timer -= delta
			if attack_timer <= 0:
				start_recovery_state()
		AttackState.RECOVERY:
			attack_timer -= delta
			if attack_timer <= 0:
				reset_attack()

func start_attack(direction: Vector2 = Vector2.RIGHT):
	if not can_attack:
		return
	
	current_attack_direction = direction
	can_attack = false
	hit_enemies.clear()
	has_applied_knockback = false
	current_state = AttackState.ACTIVE
	attack_timer = attack_duration
	sprite.visible = true
	hitbox.monitoring = true
	hitbox.monitorable = true

func start_recovery_state():
	current_state = AttackState.RECOVERY
	attack_timer = attack_cooldown
	sprite.visible = false
	hitbox.monitoring = false
	hitbox.monitorable = false

func reset_attack():
	current_state = AttackState.IDLE
	can_attack = true
	has_applied_knockback = false
	attack_finished.emit()

func apply_knockback(is_pogoable = false):
	if has_applied_knockback: return
	# Apply knockback in the opposite direction of the attack
	var knockback_direction = -current_attack_direction
	
	# Only affect velocity in the direction of the wall hit
	if abs(current_attack_direction.x) > abs(current_attack_direction.y):
		# Horizontal wall hit - only affect x velocity
		player.velocity.x = knockback_direction.x * wall_knockback_force
	elif current_attack_direction.y > 0 and is_pogoable:
		# Downward slash - pogo off enemy
		player.pogo()
	elif current_attack_direction.y < 0:
		# Ceiling hit - only affect y velocity
		player.velocity.y = knockback_direction.y * wall_knockback_force


func _on_hitbox_body_entered(body):
	if body is Enemy:
		hit_enemies.append(body)
		apply_knockback(true)
		# Apply knockback to enemy
		body.take_damage(damage, current_attack_direction, enemy_knockback)
		has_applied_knockback = true
	elif body.is_in_group("terrain"):
		apply_knockback(false)
		has_applied_knockback = true
