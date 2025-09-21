enum LINE {
    //% block="M1"
    1,
    //% block="M2"
    2,
    //% block="M3"
    3,
    //% block="M4"
    4
}

enum DIR {
    //% block="Forward"
    FORWARD,
    //% block="Backward"
    BACKWARD
}
enum COM {
    //% block="M1M2"
    1,
    //% block="M3M4"
    2
}
enum MODEL {
    //% block="Full Step (Single Coil)"
    SINGLE,
    //% block="Full step (dual coil)"
    DOUBLE,
    //% block="Half step"
    INTERLEAVE,
    //% block="Microstep"
    MICROSTEP
}

//% color="#3264C8" iconWidth=50 iconHeight=40
namespace AFMOTOR {
    //% block="Set motor [motor] direction [dir] speed [speed]" blockType="command"
    //% motor.shadow="dropdown" motor.options="LINE" BUTTON.defl="LINE.M1"
    //% dir.shadow="dropdown" dir.options="DIR" dir.defl="DIR.FORWARD"
    //% speed.shadow="range" speed.params.min=0    speed.params.max=255    speed.defl=250
    export function AFMotorInit(parameter: any, block: any) {
        let Motor = parameter.motor.code;
        let Dir = parameter.dir.code;
        let Speed = parameter.speed.code;
        Generator.addInclude('AFMOTOR_INIT', '#include <AFMotor.h>');
        Generator.addObject(`AFMOTORobj${Motor}`, `AF_DCMotor`, `motor${Motor}(${Motor});`,true);
        Generator.addCode(`motor${Motor}.setSpeed(${Speed});\n\tmotor${Motor}.run(${Dir});`);
    }
    //% block="Stop motor [motor]" blockType="command"
    //% motor.shadow="dropdown" motor.options="LINE" BUTTON.defl="LINE.M1"
    export function AFMotorStop(parameter: any, block: any) {
        let Motor = parameter.motor.code;
        Generator.addCode(`motor${Motor}.setSpeed(0);\n\t motor${Motor}.run(RELEASE);`);
    }
    //% block="Set stepper motor steps [s1] port [c1] operation mode [m1]" blockType="command"
    //% s1.shadow="number" s1.defl="2048" 
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% m1.shadow="dropdown" m1.options="MODEL"
    export function AFMotorStepperinit(parameter: any, block: any) {
        let S1 = parameter.s1.code;
        let C1 = parameter.c1.code;
        let M1 = parameter.m1.code;
        Generator.addInclude('AFMOTOR_INIT', '#include <AFMotor.h>');
        Generator.addInclude('STEPPER_INIT', '#include <AccelStepper.h>');
        Generator.addObject(`Af_Stepper${C1}`, `AF_Stepper`, `motor${C1}(${S1}, ${C1});`);
        Generator.addObject(`forwardstep${C1}`, `void`, `forwardstep${C1}() {\n\tmotor${C1}.onestep(FORWARD, ${M1});\n\t}`);
        Generator.addObject(`backwardstep${C1}`, `void`, `backwardstep${C1}() {\n\tmotor${C1}.onestep(BACKWARD, ${M1});\n\t}`);
        Generator.addObject(`Accel_Stepper${C1}`, `AccelStepper`, `stepper${C1}(forwardstep${C1}, backwardstep${C1});`);
        
    }
    //% block="Set the maximum speed of the stepper motor [c1] [speed]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% speed.shadow="number" speed.defl="500"
    export function MaxSpeedset(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let S1 = parameter.speed.code;
        Generator.addCode(`stepper${C1}.setMaxSpeed(${S1});	`);
    }
    //% block="Set motor [c1] running speed [speed]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% speed.shadow="number" speed.defl="300"
    export function SpeedInit(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let S1 = parameter.speed.code;
        Generator.addCode(`stepper${C1}.setSpeed(${S1});`);
    }
    //% block="Stepper Motor [c1] Acceleration [a1]" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
     //% a1.shadow="number"  a1.defl="50"
     export function stepperAcceleration(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let A1 = parameter.a1.code;
        Generator.addCode(`stepper${C1}.setAcceleration(${A1});`);
    }
    //% block="Stepper motor [c1] moves the target relative position [p1]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% p1.shadow="number"  p1.defl="100"
     export function stepperMove(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let P1 = parameter.p1.code;
        Generator.addCode(`stepper${C1}.move(${P1});`);
    }
    //% block="Stepper motor [c1] moves the target absolute position [p1]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% p1.shadow="number"  p1.defl="100"
    export function stepperMoveTo(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let P1 = parameter.p1.code;
        Generator.addCode(`stepper${C1}.moveTo(${P1});`);
    }
    //% block="Get the current position of the stepper motor [c1]" blockType="reporter"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function stepperCurrentPosition(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.currentPosition()`);
    }
    //% block="Get the target position of stepper motor [c1]" blockType="reporter"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function steppertargetPosition(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.targetPosition()`);
    }


    //% block="Stepper motor [c1] operation (constant speed mode)" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function stepperStart(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.runSpeed();`);
    }
    //% block="Stepper motor [c1] operation (acceleration followed by deceleration mode)" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function stepperRunStart(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.run();`);
    }
    //% block="Stop stepper motor[c1]" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
     export function stepperStop(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.stop();`);
    }

}
