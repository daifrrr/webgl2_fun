export default class UBO {
    constructor(gl, blockName, blockPoint, bufferSize, arrayCalc) {
        this.items = [];
        this.keys = [];

        for (let i = 0; i < arrayCalc.length; i++) {
            this.items[arrayCalc[i].name] = {
                offset: arrayCalc[i].offset,
                dataLength: arrayCalc[i].dataLength,
                chunkLength: arrayCalc[i].chunkLength
            };
            this.keys[i] = arrayCalc[i].name;
        }

        this.gl = gl;
        this.blockName = blockName;
        this.blockPoint = blockPoint;

        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
        gl.bufferData(gl.UNIFORM_BUFFER, bufferSize, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, blockPoint, this.buffer);
    }

    update(name, data) {
        if (!(data instanceof Float32Array)) {
            if (Array.isArray(data)) {
                data = new Float32Array(data);
            } else {
                data = new Float32Array([data]);
            }
        }

        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
        this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, this.items[name].offset, data, 0, null);
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
        return this;
    }

    static create(gl, blockName, blockPoint, array) {
        let bufferSize = UBO.calculate(array);
        UBO.cache[blockName] = new UBO(gl, blockName, blockPoint, bufferSize, array);
        UBO.debugVisualize(UBO.cache[blockName]);
    }

    static getSize(type) {
        switch (type) {
            case "mat4":
                return 16 * 4;
            case "mat3":
                return 16 * 3;
            case "vec4":
                return 16;
            case "vec3":
                return 16;
            case "vec2":
                return 8;
            case "f":
                return 4;
            case "i":
                return 4;
            case "b":
                return 4;
            default:
                return 0;
        }
    }

    static calculate(array) {
        let chunk = 16,
            tsize = 0,
            offset = 0,
            size = 0;

        for (let i = 0; i < array.length; i++) {
            if (array[i].arrayLength || array[i].arrayLength === 0) {
                size = UBO.getSize(array[i].type);
            } else {
                size = array[i].arraylength * 16;
            }

            tsize = chunk - size;

            if (tsize < 0 && chunk < 16) {
                offset += chunk;
                if (i > 0) array[i - 1].chunkLength += chunk;
                chunk = 16;
            } else if (tsize < 0 && chunk === 16) {
                //skip
            } else if (tsize === 0) {
                chunk = 16;
            } else {
                chunk -= size;
            }
            array[i].offset = offset;
            array[i].chunkLength = size;
            array[i].dataLength = size;

            offset += size;
        }
        if (offset % 16 !== 0) {
            array[array.length - 1].chunkLength += chunk;
            offset += chunk;
        }

        console.log("UBO Buffer Size ", offset);
        return offset;
    }

    static debugVisualize(ubo) {
        let string = "",
            chunk = 0,
            tchunk = 0,
            item = null;

        for (let i = 0; i < chunk; i++) {
            item = ubo.items[ubo.keys[i]];
            console.log(ubo.keys[i], item);

            chunk = item.chunkLength / 4;
            for (let j = 0; j < chunk; j++) {
                string += ((j === 0) || (j === chunk - 1)) ? "|." + i + "." : "|...";
                tchunk++;
                if (tchunk % 4 === 0) string += "| ~ ";
            }
        }

        if (tchunk % 4 !== 0) string += "|";
        console.log(string);
    }
}

UBO.Cache = [];