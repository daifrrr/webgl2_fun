import Model from './Model';
import f16 from '../objects/f16-model';
import expandVertexData from '../../node_modules/expand-vertex-data/src/expand-vertex-data';

/* refactor when we get more than one object */
let Entity = {};
export default Entity;

Entity.F16 = class {
    static createEntity(gl) {
        return new Model(Entity.F16.createMesh(gl));
    }

    static createMesh(gl) {
        let tmp = expandVertexData(f16, {facesToTriangles: true});

        return gl.fCreateMeshVAO("F16",
            tmp.positionIndices,
            tmp.positions,
            tmp.normals,
            tmp.uvs);
    }
};