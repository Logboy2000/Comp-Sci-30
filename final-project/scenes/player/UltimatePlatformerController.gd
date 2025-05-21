extends CharacterBody2D

class_name Player

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
@export_category("Dashing")
##The type of dashes the player can do.
@export_enum("None", "Horizontal", "Vertical", "Four Way", "Eight Way") var dashType: int
##How many dashes your player can do before needing to hit the ground.
@export_range(0, 10) var dashes: int = 1
##If enabled, pressing the opposite direction of a dash, during a dash, will zero the player's velocity.
@export var dashCancel: bool = true
##How far the player will dash. One of the dashing toggles must be on for this to be used.
@export_range(1.5, 4) var dashLength: float = 2.5
@export_category("Corner Cutting/Jump Correct")
##If the player's head is blocked by a jump but only by a little, the player will be nudged in the right direction and their jump will execute as intended. NEEDS RAYCASTS TO BE ATTACHED TO THE PLAYER NODE. AND ASSIGNED TO MOUNTING RAYCAST. DISTANCE OF MOUNTING DETERMINED BY PLACEMENT OF RAYCAST.
@export var cornerCutting: bool = false
##How many pixels the player will be pushed (per frame) if corner cutting is needed to correct a jump.
@export_range(1, 5) var correctionAmount: float = 1.5
##Raycast used for corner cutting calculations. Place above and to the left of the players head point up. ALL ARE NEEDED FOR IT TO WORK.
@export var leftRaycast: RayCast2D
##Raycast used for corner cutting calculations. Place above of the players head point up. ALL ARE NEEDED FOR IT TO WORK.
@export var middleRaycast: RayCast2D
##Raycast used for corner cutting calculations. Place above and to the right of the players head point up. ALL ARE NEEDED FOR IT TO WORK.
@export var rightRaycast: RayCast2D
@export_category("Down Input")
##Holding down will crouch the player. Crouching script may need to be changed depending on how your player's size proportions are. It is built for 32x player's sprites.
@export var crouch: bool = false
##Holding down and pressing the input for "roll" will execute a roll if the player is grounded. Assign a "roll" input in project settings input.
@export var canRoll: bool
@export_range(1.25, 2) var rollLength: float = 2
##If enabled, the player will stop all horizontal movement midair, wait (groundPoundPause) seconds, and then slam down into the ground when down is pressed. 
@export var groundPound: bool
##The amount of time the player will hover in the air before completing a ground pound (in seconds)
@export_range(0.05, 0.75) var groundPoundPause: float = 0.25
##If enabled, pressing up will end the ground pound early
@export var upToCancel: bool = false

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
var dashMagnitude: float
var gravityActive: bool = true
var dashing: bool = false
var dashCount: int
var rolling: bool = false

var twoWayDashHorizontal
var twoWayDashVertical
var eightWayDash

var wasMovingR: bool
var wasPressingR: bool
var movementInputMonitoring: Vector2 = Vector2(true, true) #movementInputMonitoring.x addresses right direction while .y addresses left direction

var gdelta: float = 1

var dset = false

var colliderScaleLockY
var colliderPosLockY

var latched
var wasLatched
var crouching
var groundPounding

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
var latchHold
var dashTap
var rollTap
var downTap
var twirlTap

@export var max_health: int = 5
@export var invincibility_frames: int = 80
var current_health: int = 0
@export var knockback_force: Vector2 = Vector2(400.0, 250.0)
@export var knockback_freeze_time: float = 0.15
var facing_right: bool = true

func _ready():
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
	
	dashMagnitude = maxSpeed * dashLength
	dashCount = dashes
	
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
	
	
	twoWayDashHorizontal = false
	twoWayDashVertical = false
	eightWayDash = false
	if dashType == 0:
		pass
	if dashType == 1:
		twoWayDashHorizontal = true
	elif dashType == 2:
		twoWayDashVertical = true
	elif dashType == 3:
		twoWayDashHorizontal = true
		twoWayDashVertical = true
	elif dashType == 4:
		eightWayDash = true
	
	

func _process(_delta):
	visible = !is_dead
	if is_dead:
		return
	
	#INFO animations
	#directions
	if is_on_wall() and !is_on_floor() and latch and wallLatching and ((wallLatchingModifer and latchHold) or !wallLatchingModifer):
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
	if run and idle and !dashing and !crouching and !walk:
		if abs(velocity.x) > 0.1 and is_on_floor() and !is_on_wall():
			anim.speed_scale = abs(velocity.x / 150)
			anim.play("run")
		elif abs(velocity.x) < 0.1 and is_on_floor():
			anim.speed_scale = 1
			anim.play("idle")
	elif run and idle and walk and !dashing and !crouching:
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
	if velocity.y < 0 and jump and !dashing:
		anim.speed_scale = 1
		anim.play("jump")
		
	if velocity.y > 40 and falling and !dashing and !crouching:
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
			
		#dash
		if dashing:
			anim.speed_scale = 1
			anim.play("dash")
			
		#crouch
		if crouching and !rolling:
			if abs(velocity.x) > 10:
				anim.speed_scale = 1
				anim.play("crouch_walk")
			else:
				anim.speed_scale = 1
				anim.play("crouch_idle")
		
		if rollTap and canRoll and roll:
			anim.speed_scale = 1
			anim.play("roll")
		
		
		

func _physics_process(delta):
	visible = !is_dead
	if is_dead or Global.is_transitioning:
		return
	if current_invincibility_frames > 0:
		current_invincibility_frames -= 1
		vulnurable = false
	else:
		vulnurable = true
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
	latchHold = Input.is_action_pressed("latch")
	dashTap = Input.is_action_just_pressed("dash")
	rollTap = Input.is_action_just_pressed("roll")
	downTap = Input.is_action_just_pressed("down")
	twirlTap = Input.is_action_just_pressed("twirl")
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
			
	#INFO Crouching
	if crouch:
		if downHold and is_on_floor():
			crouching = true
		elif !downHold and !rolling:
			crouching = false
			
	if !is_on_floor():
		crouching = false
			
	if crouching:
		maxSpeed = maxSpeedLock / 2
		col.scale.y = colliderScaleLockY / 2
		col.position.y = colliderPosLockY + (8 * colliderScaleLockY)
	elif !runningModifier or (runningModifier and runHold):
		maxSpeed = maxSpeedLock
		col.scale.y = colliderScaleLockY
		col.position.y = colliderPosLockY
		
	#INFO Rolling
	if canRoll and is_on_floor() and rollTap and crouching:
		_rollingTime(rollLength * 0.25)
		if wasPressingR and !(upHold):
			velocity.y = 0
			velocity.x = maxSpeedLock * rollLength
			dashCount += -1
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(rollLength * 0.0625)
		elif !(upHold):
			velocity.y = 0
			velocity.x = -maxSpeedLock * rollLength
			dashCount += -1
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(rollLength * 0.0625)
		
	if canRoll and rolling:
		#if you want your player to become immune or do something else while rolling, add that here.
		pass
			
	#INFO Jump and Gravity
	if velocity.y > 0:
		appliedGravity = gravityScale * descendingGravityFactor
	else:
		appliedGravity = gravityScale
	
	if is_on_wall() and !groundPounding:
		appliedTerminalVelocity = terminalVelocity / wallSliding
		if wallLatching and ((wallLatchingModifer and latchHold) or !wallLatchingModifer):
			appliedGravity = 0
			
			if velocity.y < 0:
				velocity.y += 50
			if velocity.y > 0:
				velocity.y = 0
				
			if wallLatchingModifer and latchHold and movementInputMonitoring == Vector2(true, true):
				velocity.x = 0
			
		elif wallSliding != 1 and velocity.y > 0:
			appliedGravity = appliedGravity / wallSliding
	elif !is_on_wall() and !groundPounding:
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
			_endGroundPound()
			
			
	#INFO dashing
	if is_on_floor() or is_on_wall():
		dashCount = dashes
	if eightWayDash and dashTap and dashCount > 0 and !rolling:
		var input_direction = Input.get_vector("left", "right", "up", "down")
		var dTime = 0.0625 * dashLength
		_dashingTime(dTime)
		_pauseGravity(dTime)
		velocity = dashMagnitude * input_direction
		if (!rightHold and !leftHold and !downHold and !upHold) and wasMovingR:
			velocity.x = dashMagnitude
		elif (!rightHold and !leftHold and !downHold and !upHold) and !wasMovingR:
			velocity.x = -dashMagnitude
		dashCount += -1
		movementInputMonitoring = Vector2(false, false)
		_inputPauseReset(dTime)
	
	if twoWayDashVertical and dashTap and dashCount > 0 and !rolling:
		var dTime = 0.0625 * dashLength
		if upHold and downHold:
			pass
		elif upHold:
			_dashingTime(dTime)
			_pauseGravity(dTime)
			velocity.x = 0
			velocity.y = -dashMagnitude
			dashCount += -1
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(dTime)
		elif downHold and dashCount > 0:
			_dashingTime(dTime)
			_pauseGravity(dTime)
			velocity.x = 0
			velocity.y = dashMagnitude
			dashCount += -1
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(dTime)
	
	if twoWayDashHorizontal and dashTap and dashCount > 0 and !rolling:
		var dTime = 0.0625 * dashLength
		if wasPressingR and !(upHold or downHold):
			velocity.y = 0
			velocity.x = dashMagnitude
			_pauseGravity(dTime)
			_dashingTime(dTime)
			dashCount += -1
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(dTime)
		elif !(upHold or downHold):
			velocity.y = 0
			velocity.x = -dashMagnitude
			_pauseGravity(dTime)
			_dashingTime(dTime)
			dashCount += -1
			movementInputMonitoring = Vector2(false, false)
			_inputPauseReset(dTime)
			
	if dashing and velocity.x > 0 and leftTap and dashCancel:
		velocity.x = 0
	if dashing and velocity.x < 0 and rightTap and dashCancel:
		velocity.x = 0
	
	#INFO Corner Cutting
	if cornerCutting:
		if velocity.y < 0 and leftRaycast.is_colliding() and !rightRaycast.is_colliding() and !middleRaycast.is_colliding():
			position.x += correctionAmount
		if velocity.y < 0 and !leftRaycast.is_colliding() and rightRaycast.is_colliding() and !middleRaycast.is_colliding():
			position.x -= correctionAmount
			
	#INFO Ground Pound
	if groundPound and downTap and !is_on_floor() and !is_on_wall():
		groundPounding = true
		gravityActive = false
		velocity.y = 0
		await get_tree().create_timer(groundPoundPause).timeout
		_groundPound()
	if is_on_floor() and groundPounding:
		_endGroundPound()
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
			is_attacking = true
			if attack_direction == Vector2.UP:
				upward_attack.start_attack()
			elif attack_direction == Vector2.DOWN:
				downward_attack.start_attack()
			elif attack_direction == Vector2.LEFT:
				left_attack.start_attack()
			else:
				right_attack.start_attack()
	if upToCancel and upHold and groundPound:
		_endGroundPound()
	
	
	

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
	if wallLatchingModifer and latchHold:
		dir = -1
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

func _dashingTime(time):
	dashing = true
	await get_tree().create_timer(time).timeout
	dashing = false
	if !is_on_floor():
		velocity.y = -gravityScale * 10

func _rollingTime(time):
	rolling = true
	await get_tree().create_timer(time).timeout
	rolling = false

func _groundPound():
	appliedTerminalVelocity = terminalVelocity * 10
	velocity.y = jumpMagnitude * 2
	
func _endGroundPound():
	groundPounding = false
	appliedTerminalVelocity = terminalVelocity
	gravityActive = true


func _on_owie_box_area_entered(area: Area2D) -> void:
	if area is RoomTransition:
		Global.room_manager.change_room(area.target_room, area.entrance_id)

func owie(amount: int, damage_position: Vector2 = global_position):
	if not vulnurable:
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
	
	for body in owie_box.get_overlapping_bodies():
		if body is Enemy:
			owie(1, body.position)

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
