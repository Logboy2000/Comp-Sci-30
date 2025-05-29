extends Node2D

signal attack_finished

@onready var hitbox: Area2D = $Hitbox
@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

@export var damage = 5.0
@export var attack_cooldown = 0
@export var attack_duration = 0.1
@export var wall_knockback_force = 250.0
@export var enemy_knockback = 500.0
@onready var recovery_timer: Timer = $RecoveryTimer

enum AttackState {
	IDLE,
	ACTIVE,
	RECOVERY
}

var current_state = AttackState.IDLE
var can_attack = true
var hit_enemies = []
@export var attack_direction = Vector2.RIGHT
var player: Player
var has_applied_knockback = false

func _ready():
	visible = false
	hitbox.monitoring = false
	hitbox.monitorable = false
	player = get_parent()


func start_attack():
	if not can_attack:
		return
	
	if attack_direction == Vector2.DOWN:
		sprite.flip_v = player.facing_right
	
	can_attack = false
	hit_enemies.clear()
	has_applied_knockback = false
	current_state = AttackState.ACTIVE
	
	visible = true
	sprite.play("attack")
	hitbox.monitoring = true
	hitbox.monitorable = true

func apply_knockback(is_pogoable = false):
	if has_applied_knockback: return
	# Apply knockback in the opposite direction of the attack
	var knockback_direction = -attack_direction
	
	# Only affect velocity in the direction of the wall hit
	if abs(attack_direction.x) > abs(attack_direction.y):
		# Horizontal wall hit - only affect x velocity
		player.velocity.x = knockback_direction.x * wall_knockback_force
	elif attack_direction.y > 0 and is_pogoable:
		# Downward slash - pogo off enemy
		player.pogo()
	elif attack_direction.y < 0:
		# Ceiling hit - only affect y velocity
		player.velocity.y = knockback_direction.y * wall_knockback_force

func _on_hitbox_body_entered(body):
	if body is Enemy:
		hit_enemies.append(body)
		apply_knockback(true)
		# Apply knockback to enemy
		body.take_damage(damage, attack_direction, enemy_knockback)
		has_applied_knockback = true

func _on_animated_sprite_2d_animation_finished() -> void:
	current_state = AttackState.RECOVERY
	visible = false
	hitbox.monitoring = false
	hitbox.monitorable = false
	recovery_timer.start()

func _on_recovery_timer_timeout() -> void:
	current_state = AttackState.IDLE
	can_attack = true
	has_applied_knockback = false
	attack_finished.emit() 
