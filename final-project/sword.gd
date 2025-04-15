extends Node2D

@onready var sprite: Polygon2D = $Sprite
@onready var hitbox: Area2D = $Hitbox

@export var damage = 10
@export var attack_cooldown = 0.1
@export var attack_duration = 0.3

enum AttackState {
	IDLE,
	ACTIVE,
	RECOVERY
}

var current_state = AttackState.IDLE
var attack_timer = 0.0
var can_attack = true
var hit_enemies = []

func _ready():
	hitbox.monitoring = false
	hitbox.monitorable = false

func _process(delta):
	match current_state:
		AttackState.IDLE:
			pass
		AttackState.ACTIVE:
			attack_timer -= delta
			if attack_timer <= 0:
				start_recovery_state()
		AttackState.RECOVERY:
			attack_timer -= delta
			if attack_timer <= 0:
				reset_attack()




func start_attack():
	if not can_attack:
		return
	
	can_attack = false
	hit_enemies.clear()
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

func _on_hitbox_body_entered(body):
	if body.is_in_group("enemy") and not hit_enemies.has(body):
		hit_enemies.append(body)
		# Signal to enemy that they've been hit
		body.take_damage(damage) 
