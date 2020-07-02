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
    //% block="前进"
    FORWARD,
    //% block="后退"
    BACKWARD
}
enum COM {
    //% block="M1M2"
    1,
    //% block="M3M4"
    2
}
enum MODEL {
    //% block="全步进(单线圈)"
    SINGLE,
    //% block="全步进(双线圈)"
    DOUBLE,
    //% block="半步进"
    INTERLEAVE,
    //% block="微步进"
    MICROSTEP
}


//% color="#3264C8" iconWidth=50 iconHeight=40
namespace AFMOTOR {
    //% block="设置电机 [motor] 方向 [dir]速度 [speed]" blockType="command"
    //% motor.shadow="dropdown" motor.options="LINE" BUTTON.defl="LINE.M1"
    //% dir.shadow="dropdown" dir.options="DIR" dir.defl="DIR.前进"
    //% speed.shadow="range" speed.params.min=0    speed.params.max=255    speed.defl=200
    export function AFMotorInit(parameter: any, block: any) {
        let Motor = parameter.motor.code;
        let Dir = parameter.dir.code;
        let Speed = parameter.speed.code;
        Generator.addInclude('AFMOTOR_INIT', '#include <AFMotor.h>');
        Generator.addObject(`AFMOTORobj${Motor}`, `AF_DCMotor`, `motor${Motor}(${Motor});`,true);
        Generator.addCode(`motor${Motor}.setSpeed(${Speed});\n\tmotor${Motor}.run(${Dir});`);
    }
    //% block="停止电机 [motor]" blockType="command"
    //% motor.shadow="dropdown" motor.options="LINE" BUTTON.defl="LINE.M1"
    export function AFMotorStop(parameter: any, block: any) {
        let Motor = parameter.motor.code;
        Generator.addCode(`motor${Motor}.setSpeed(0);\n\t motor${Motor}.run(RELEASE);`);
    }
    //% block="设置步进电机步数 [s1] 端口[c1] 运转模式[m1]" blockType="command"
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
    //% block="设置步进电机[c1]最大速度 [speed]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% speed.shadow="number" speed.defl="500"
    export function MaxSpeedset(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let S1 = parameter.speed.code;
        Generator.addCode(`stepper${C1}.setMaxSpeed(${S1});	`);
    }
    //% block="设置电机[c1]运行速度 [speed]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% speed.shadow="number" speed.defl="300"
    export function SpeedInit(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let S1 = parameter.speed.code;
        Generator.addCode(`stepper${C1}.setSpeed(${S1});`);
    }
    //% block="步进电机[c1]加速度[a1]" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
     //% a1.shadow="number"  a1.defl="50"
     export function stepperAcceleration(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let A1 = parameter.a1.code;
        Generator.addCode(`stepper${C1}.setAcceleration(${A1});`);
    }
    //% block="步进电机[c1]移动目标相对位置[p1]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% p1.shadow="number"  p1.defl="100"
     export function stepperMove(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let P1 = parameter.p1.code;
        Generator.addCode(`stepper${C1}.move(${P1});`);
    }
    //% block="步进电机[c1]移动目标绝对位置[p1]" blockType="command"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    //% p1.shadow="number"  p1.defl="100"
    export function stepperMoveTo(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        let P1 = parameter.p1.code;
        Generator.addCode(`stepper${C1}.moveTo(${P1});`);
    }
    //% block="获取步进电机[c1]运行当前位置" blockType="reporter"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function stepperCurrentPosition(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.currentPosition()`);
    }
    //% block="获取步进电机[c1]运行目标位置" blockType="reporter"
    //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function steppertargetPosition(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.targetPosition()`);
    }


    //% block="步进电机[c1]运行(匀速模式)" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function stepperStart(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.runSpeed();`);
    }
    //% block="步进电机[c1]运行(先加速后减速模式)" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
    export function stepperRunStart(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.run();`);
    }
    //% block="停止步进电机[c1]" blockType="command"
     //% c1.shadow="dropdown" c1.options="COM" c1.defl="COM.M1M2"
     export function stepperStop(parameter: any, block: any) {
        let C1 = parameter.c1.code;
        Generator.addCode(`stepper${C1}.stop();`);
    }

}
