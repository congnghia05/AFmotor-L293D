
enum SIZE {
    //% block="29*29"
    1,
    //% block="58*58"
    2
}

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
        Generator.addInclude('AFMOTORINIT', '#include <AFMotor.h>');
        Generator.addObject(`AFMOTORobj${Motor}`, `AF_DCMotor`, `motor${Motor}(${Motor});`,true);
        Generator.addCode(`motor${Motor}.setSpeed(${Speed});\n\tmotor${Motor}.run(${Dir});`);
    }
    
    //% block="停止电机 [motor]" blockType="command"
    //% motor.shadow="dropdown" motor.options="LINE" BUTTON.defl="LINE.M1"
    export function AFMotorStop(parameter: any, block: any) {
        let Motor = parameter.motor.code;
        Generator.addCode(`motor${Motor}.setSpeed(0);\n\t motor${Motor}.run(RELEASE);`);
    }
   

}
