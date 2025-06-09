class_name Player extends CharacterBody2D

# Audio
const SLASH_SOUND = preload("res://audio/slash.wav")
const CLASSIC_HURT = preload("res://audio/classic_hurt.mp3")
@onready var right_attack: Node2D = $RightAttack
@onready var left_attack: Node2D = $LeftAttack
@onready var downward_attack = $DownwardAttack
@onready var upward_attack: = $UpwardAttack
@onready var owie_box: Area2D = $OwieBox
var attack_direction: Vector2
var is_attacking: bool = false

@export_category("Necesary Child Nodes")
@export var PlayerSprite: AnimatedSprite2D
@export var PlayerCollider: CollisionShape2D
@export var animation_player: AnimationPlayer


#INFO HORIZONTAL MOVEMENT 
@export_category("L/R Movement")
##The max speed your player will move
@export_range(50, 500) var maxSpeed: float = 200.0
##How fast your player will reach max speed from rest (in seconds)
@export_range(0, 4) var timeToReachMaxSpeed: float = 0.2
##How fast your player will reach zero speed from max speed (in seconds)
@export_range(0, 4) var timeToReachZeroSpeed: float = 0.2
##If true, player will instantly move and switch directions. Overrides the "timeToReach" variables, setting them to 0.
@export var directionalSnap: bool = false
##If enabled, the default movement speed will by 1/2 of the maxSpeed and the player must hold a "run" button to accelerate to max speed. Assign "run" (case sensitive) in the project input settings.
@export var runningModifier: bool = false

#INFO JUMPING 
@export_category("Jumping and Gravity")
##The peak height of your player's jump
@export_range(0, 20) var jumpHeight: float = 2.0
##How many jumps your character can do before needing to touch the ground again. Giving more than 1 jump disables jump buffering and coyote time.
@export_range(0, 4) var jumps: int = 1
##The strength at which your character will be pulled to the ground.
@export_range(0, 100) var gravityScale: float = 20.0
##The fastest your player can fall
@export_range(0, 1000) var terminalVelocity: float = 500.0
##Your player will move this amount faster when falling providing a less floaty jump curve.
@export_range(0.5, 3) var descendingGravityFactor: float = 1.3
##Enabling this toggle makes it so that when the player releases the jump key while still ascending, their vertical velocity will cut by the height cut, providing variable jump height.
@export var shortHopAkaVariableJumpHeight: bool = true
##How much the jump height is cut by.
@export_range(1, 10) var jumpVariable: float = 2
##How much extra time (in seconds) your player will be given to jump after falling off an edge. This is set to 0.2 seconds by default.
@export_range(0, 0.5) var coyoteTime: float = 0.2
##The window of time (in seconds) that your player can press the jump button before hitting the ground and still have their input registered as a jump. This is set to 0.2 seconds by default.
@export_range(0, 0.5) var jumpBuffering: float = 0.2

@export var pogo_velocity: float = -300.0


#INFO EXTRAS
@export_category("Wall Jumping")
##Allows your player to jump off of walls. Without a Wall Kick Angle, the player will be able to scale the wall.
@export var wallJump: bool = false
##How long the player's movement input will be ignored after wall jumping.
@export_range(0, 0.5) var inputPauseAfterWallJump: float = 0.1
##The angle at which your player will jump away from the wall. 0 is straight away from the wall, 90 is straight up. Does not account for gravity
@export_range(0, 90) var wallKickAngle: float = 60.0
##The player's gravity will be divided by this number when touch a wall and descending. Set to 1 by default meaning no change will be made to the gravity and there is effectively no wall sliding. THIS IS OVERRIDDED BY WALL LATCH.
@export_range(1, 20) var wallSliding: float = 1.0
##If enabled, the player's gravity will be set to 0 when touching a wall and descending. THIS WILL OVERRIDE WALLSLIDING.
@export var wallLatching: bool = false
##wall latching must be enabled for this to work. #If enabled, the player must hold down the "latch" key to wall latch. Assign "latch" in the project input settings. The player's input will be ignored when latching.
@export var wallLatchingModifer: bool = false

@export_category("Roll")
##Holding down and pressing the input for "roll" will execute a roll if the player is grounded. Assign a "roll" input in project settings input.
@export var canRoll: bool
@export var rollLength: float = 4

@export_category("Animations (Check Box if has animation)")
##Animations must be named "run" all lowercase as the check box says
@export var run: bool
##Animations must be named "jump" all lowercase as the check box says
@export var jump: bool
##Animations must be named "idle" all lowercase as the check box says
@export var idle: bool
##Animations must be named "walk" all lowercase as the check box says
@export var walk: bool
##Animations must be named "slide" all lowercase as the check box says
@export var slide: bool
##Animations must be named "latch" all lowercase as the check box says
@export var latch: bool
##Animations must be named "falling" all lowercase as the check box says
@export var falling: bool
##Animations must be named "crouch_idle" all lowercase as the check box says
@export var crouch_idle: bool
##Animations must be named "crouch_walk" all lowercase as the check box says
@export var crouch_walk: bool
##Animations must be named "roll" all lowercase as the check box says
@export var roll: bool



#Variables determined by the developer set ones.
var appliedGravity: float
var maxSpeedLock: float
var appliedTerminalVelocity: float

var friction: float
var acceleration: float
var deceleration: float
var instantAccel: bool = false
var instantStop: bool = false

var jumpMagnitude: float = 500.0
var jumpCount: int
var jumpWasPressed: bool = false
var coyoteActive: bool = false
var gravityActive: bool = true
var rolling: bool = false

var wasMovingR: bool
var wasPressingR: bool
var movementInputMonitoring: Vector2 = Vector2(true, true) #movementInputMonitoring.x addresses right direction while .y addresses left direction

var gdelta: float = 1

var dset = false

var colliderScaleLockY
var colliderPosLockY

var latched
var wasLatched

var anim
var col
var animScaleLock : Vector2

var vulnurable := true
var current_invincibility_frames := 0
var is_dead := false

#Input Variables for the whole script
var upHold
var downHold
var leftHold
var leftTap
var leftRelease
var rightHold
var rightTap
var rightRelease
var jumpTap
var jumpRelease
var runHold
var rollTap
var downTap

@export var max_health: int = 10
@export var invincibility_frames: int = 80
var current_health: int = 0
@export var knockback_force: Vector2 = Vector2(400.0, 250.0)
@export var knockback_freeze_time: float = 0.15
var facing_right: bool = true

func _ready():
	canRoll = SettingsManager.get_setting("has_roll")
	max_health = SettingsManager.get_setting("max_hp")
	wallJump = SettingsManager.get_setting("has_wj")
	
	Global.player = self
	current_health = max_health
	
	wasMovingR = true
	anim = PlayerSprite
	col = PlayerCollider
	
	
	
	
	_updateData()
	
func _updateData():
	acceleration = maxSpeed / timeToReachMaxSpeed
	deceleration = -maxSpeed / timeToReachZeroSpeed
	
	jumpMagnitude = (10.0 * jumpHeight) * gravityScale
	jumpCount = jumps
	
	
	maxSpeedLock = maxSpeed
	
	animScaleLock = abs(anim.scale)
	colliderScaleLockY = col.scale.y
	colliderPosLockY = col.position.y
	
	if timeToReachMaxSpeed == 0:
		instantAccel = true
		timeToReachMaxSpeed = 1
	elif timeToReachMaxSpeed < 0:
		timeToReachMaxSpeed = abs(timeToReachMaxSpeed)
		instantAccel = false
	else:
		instantAccel = false
		
	if timeToReachZeroSpeed == 0:
		instantStop = true
		timeToReachZeroSpeed = 1
	elif timeToReachMaxSpeed < 0:
		timeToReachMaxSpeed = abs(timeToReachMaxSpeed)
		instantStop = false
	else:
		instantStop = false
		
	if jumps > 1:
		jumpBuffering = 0
		coyoteTime = 0
	
	coyoteTime = abs(coyoteTime)
	jumpBuffering = abs(jumpBuffering)
	
	if directionalSnap:
		instantAccel = true
		instantStop = true
	
	
	
	

func _process(_delta):
	visible = !is_dead
	if is_dead:
		return
	
	
	#INFO animations
	#directions
	if is_on_wall() and !is_on_floor() and latch and wallLatching:
		latched = true
	else:
		latched = false
		wasLatched = true
		_setLatch(0.2, false)

	if rightHold and !latched:
		facing_right = true
		anim.flip_h = false
	if leftHold and !latched:
		facing_right = false
		anim.flip_h = true
	
	#run
	if run and idle and !walk:
		if abs(velocity.x) > 0.1 and is_on_floor() and !is_on_wall():
			anim.speed_scale = abs(velocity.x / 150)
			anim.play("run")
		elif abs(velocity.x) < 0.1 and is_on_floor():
			anim.speed_scale = 1
			anim.play("idle")
	elif run and idle and walk:
		if abs(velocity.x) > 0.1 and is_on_floor() and !is_on_wall():
			anim.speed_scale = abs(velocity.x / 150)
			if abs(velocity.x) < (maxSpeedLock):
				anim.play("walk")
			else:
				anim.play("run")
		elif abs(velocity.x) < 0.1 and is_on_floor():
			anim.speed_scale = 1
			anim.play("idle")
		
	#jump
	if velocity.y < 0 and jump:
		anim.speed_scale = 1
		anim.play("jump")
		
	if velocity.y > 40 and falling:
		anim.speed_scale = 1
		anim.play("falling")
		
	if latch and slide:
		#wall slide and latch
		if latched and !wasLatched:
			anim.speed_scale = 1
			anim.play("latch")
		if is_on_wall() and velocity.y > 0 and slide and anim.animation != "slide" and wallSliding != 1:
			anim.speed_scale = 1
			anim.play("slide")
			
		
		
		if rollTap and canRoll and roll:
			anim.speed_scale = 1
			anim.play("roll")
		
		
		

func _physics_process(delta):
	visible = !is_dead
	if is_dead or Global.is_transitioning:
		move_and_slide()
		return
	if current_invincibility_frames > 0:
		current_invincibility_frames -= 1
		vulnurable = false
	else:
		vulnurable = true
		for body in owie_box.get_overlapping_bodies():
			if body is Enemy:
				owie(body.contact_damage, body.global_position)
	if is_dead:
		return
	if !dset:
		gdelta = delta
		dset = true
	#INFO Input Detectio. Define your inputs from the project settings here.
	leftHold = Input.is_action_pressed("left")
	rightHold = Input.is_action_pressed("right")
	upHold = Input.is_action_pressed("up")
	downHold = Input.is_action_pressed("down")
	leftTap = Input.is_action_just_pressed("left")
	rightTap = Input.is_action_just_pressed("right")
	leftRelease = Input.is_action_just_released("left")
	rightRelease = Input.is_action_just_released("right")
	jumpTap = Input.is_action_just_pressed("jump")
	jumpRelease = Input.is_action_just_released("jump")
	runHold = Input.is_action_pressed("run")
	rollTap = Input.is_action_just_pressed("roll")
	downTap = Input.is_action_just_pressed("down")
	if Input.is_action_just_pressed("owie"):
		owie(1)
	if Input.is_action_just_pressed("reverse_owie"):
		reverse_owie(1)
	if Input.is_action_just_pressed("die"):
		die()
	
	handle_owie()
	#INFO Left and Right Movement
	
	if rightHold and leftHold and movementInputMonitoring:
		if !instantStop:
			_decelerate(delta, false)
		else:
			velocity.x = -0.1
	elif rightHold and movementInputMonitoring.x:
		if velocity.x > maxSpeed or instantAccel:
			velocity.x = maxSpeed
		else:
			velocity.x += acceleration * delta
		if velocity.x < 0:
			if !instantStop:
				_decelerate(delta, false)
			else:
				velocity.x = -0.1
	elif leftHold and movementInputMonitoring.y:
		if velocity.x < -maxSpeed or instantAccel:
			velocity.x = -maxSpeed
		else:
			velocity.x -= acceleration * delta
		if velocity.x > 0:
			if !instantStop:
				_decelerate(delta, false)
			else:
				velocity.x = 0.1
				
	if velocity.x > 0:
		wasMovingR = true
	elif velocity.x < 0:
		wasMovingR = false
		
	if rightTap:
		wasPressingR = true
	if leftTap:
		wasPressingR = false
	
	if runningModifier and !runHold:
		maxSpeed = maxSpeedLock / 2
	elif is_on_floor(): 
		maxSpeed = maxSpeedLock
	
	if !(leftHold or rightHold):
		if !instantStop:
			_decelerate(delta, false)
		else:
			velocity.x = 0
			
			
			
	if !runningModifier or (runningModifier and runHold):
		maxSpeed = maxSpeedLock
		col.scale.y = colliderScaleLockY
		col.position.y = colliderPosLockY
		
	#INFO Rolling
	if canRoll and is_on_floor() and rollTap:
		_rollingTime(rollLength * 0.25)
		if facing_right:
			velocity.y = 0
			velocity.x = maxSpeedLock * rollLength
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(rollLength * 0.0625)
		else:
			velocity.y = 0
			velocity.x = -maxSpeedLock * rollLength
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(rollLength * 0.0625)
		
			
	#INFO Jump and Gravity
	if velocity.y > 0:
		appliedGravity = gravityScale * descendingGravityFactor
	else:
		appliedGravity = gravityScale
	
	if is_on_wall() and wallJump:
		appliedTerminalVelocity = terminalVelocity / wallSliding
		if wallLatching:
			appliedGravity = 0
			
			if velocity.y < 0:
				velocity.y += 50
			if velocity.y > 0:
				velocity.y = 0
				
			
		elif wallSliding != 1 and velocity.y > 0:
			appliedGravity = appliedGravity / wallSliding
	elif !is_on_wall():
		appliedTerminalVelocity = terminalVelocity
	
	if gravityActive:
		if velocity.y < appliedTerminalVelocity:
			velocity.y += appliedGravity
		elif velocity.y > appliedTerminalVelocity:
				velocity.y = appliedTerminalVelocity
		
	if shortHopAkaVariableJumpHeight and jumpRelease and velocity.y < 0:
		velocity.y = velocity.y / jumpVariable
	
	if jumps == 1:
		if !is_on_floor() and !is_on_wall():
			if coyoteTime > 0:
				coyoteActive = true
				_coyoteTime()
				
		if jumpTap and !is_on_wall():
			if coyoteActive:
				coyoteActive = false
				_jump()
			if jumpBuffering > 0:
				jumpWasPressed = true
				_bufferJump()
			elif jumpBuffering == 0 and coyoteTime == 0 and is_on_floor():
				_jump()
		elif jumpTap and is_on_wall() and !is_on_floor():
			if wallJump and !latched:
				_wallJump()
			elif wallJump and latched:
				_wallJump()
		elif jumpTap and is_on_floor():
			_jump()
			
		if is_on_floor():
			jumpCount = jumps
			if coyoteTime > 0:
				coyoteActive = true
			else:
				coyoteActive = false
			if jumpWasPressed:
				_jump()

	elif jumps > 1:
		if is_on_floor():
			jumpCount = jumps
		if jumpTap and is_on_wall() and wallJump:
			_wallJump()
		elif jumpTap and jumpCount > 0:
			velocity.y = -jumpMagnitude
			jumpCount = jumpCount - 1
			
			
	
	
	
	

	move_and_slide()
	# Update attack direction based on input
	if not is_attacking:
		if Input.is_action_pressed("up"):
			attack_direction = Vector2.UP
		elif Input.is_action_pressed("down") and not is_on_floor():
			attack_direction = Vector2.DOWN
		else:
			attack_direction = Vector2.RIGHT if facing_right else Vector2.LEFT
		
		# Handle attack
		if Input.is_action_just_pressed("attack"):
			Audio.play_sound(SLASH_SOUND, 0.9, 1.1)
			is_attacking = true
			if attack_direction == Vector2.UP:
				upward_attack.start_attack()
			elif attack_direction == Vector2.DOWN:
				downward_attack.start_attack()
			elif attack_direction == Vector2.LEFT:
				left_attack.start_attack()
			else:
				right_attack.start_attack()
	
	
	

func _bufferJump():
	await get_tree().create_timer(jumpBuffering).timeout
	jumpWasPressed = false

func _coyoteTime():
	await get_tree().create_timer(coyoteTime).timeout
	coyoteActive = false
	jumpCount += -1

	
func _jump():
	if jumpCount > 0:
		velocity.y = -jumpMagnitude
		jumpCount += -1
		jumpWasPressed = false
		
func _wallJump():
	var horizontalWallKick = abs(jumpMagnitude * cos(wallKickAngle * (PI / 180)))
	var verticalWallKick = abs(jumpMagnitude * sin(wallKickAngle * (PI / 180)))
	velocity.y = -verticalWallKick
	var dir = 1
	if wasMovingR:
		velocity.x = -horizontalWallKick  * dir
	else:
		velocity.x = horizontalWallKick * dir
	if inputPauseAfterWallJump != 0:
		movementInputMonitoring = Vector2(false, false)
		_inputPauseReset(inputPauseAfterWallJump)
			
func _setLatch(delay, setBool):
	await get_tree().create_timer(delay).timeout
	wasLatched = setBool
			
func _inputPauseReset(time):
	await get_tree().create_timer(time).timeout
	movementInputMonitoring = Vector2(true, true)
	

func _decelerate(delta, vertical):
	if !vertical:
		if (abs(velocity.x) > 0) and (abs(velocity.x) <= abs(deceleration * delta)):
			velocity.x = 0 
		elif velocity.x > 0:
			velocity.x += deceleration * delta
		elif velocity.x < 0:
			velocity.x -= deceleration * delta
	elif vertical and velocity.y > 0:
		velocity.y += deceleration * delta


func _pauseGravity(time):
	gravityActive = false
	await get_tree().create_timer(time).timeout
	gravityActive = true

func _rollingTime(time):
	rolling = true
	await get_tree().create_timer(time).timeout
	rolling = false


func _on_owie_box_area_entered(area: Area2D) -> void:
	if area is RoomTransition:
		Global.room_manager.change_room(area.target_room, area.entrance_id)

func owie(amount: int, damage_position: Vector2 = global_position):
	if rolling or not vulnurable or amount <= 0:
		return
	
	is_attacking = false
	vulnurable = false
	
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
	else:
		Audio.play_sound(CLASSIC_HURT)

func die():
	is_dead = true
	Global.die()

func respawn():
	is_dead = false
	visible = true
	current_health = max_health
	Global.player_hp_bar.update_health_ui()

func reverse_owie(amount: int = 1):
	current_health += amount
	if current_health > max_health:
		current_health = max_health
	Global.player_hp_bar.update_health_ui()

func handle_owie():
	if vulnurable:
		animation_player.play("RESET")
	else:
		animation_player.play("invulnerable")

func _on_forward_attack_attack_finished():
	is_attacking = false

func _on_upward_attack_attack_finished() -> void:
	is_attacking = false

func _on_downward_attack_attack_finished() -> void:
	is_attacking = false

func pogo():
	if is_on_floor():
		return
	velocity.y = pogo_velocity




func _on_owie_box_body_entered(body: Node2D) -> void:
	if body is Enemy and vulnurable and not rolling:
		owie(body.contact_damage, body.global_position)
		if body.kill_self_on_contact == true:
			body.die()
