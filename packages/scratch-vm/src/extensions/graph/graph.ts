type vertex = string;
type edge = [vertex,vertex];

//simple undirected graph: no loops, no multiedges
export class Graph {
    private adjTable : Map<vertex,Set<vertex>>;
    readonly max_size : number;
    private verbose : boolean;


    constructor(max_size : number = 20, verbose : boolean = true) {
        this.adjTable = new Map<vertex,Set<vertex>>();
        this.max_size = max_size;
        this.verbose = verbose;
    }

    size() : number {
        if (this.verbose) console.log(`graph size: ${this.adjTable.size}`);
        return this.adjTable.size;
    }

    exists(v : vertex) : boolean {
        const neighbors = this.adjTable.get(v);
        const res = neighbors !== null && neighbors !== undefined;
        if (this.verbose) console.log(`vertex ${v} ${res ? 'exists' : 'does not exist'}`);
        return res;
    }

    existsEdge([v1,v2] : edge) {
        const v1_neighbors = this.adjTable.get(v1);
        const v2_neighbors = this.adjTable.get(v2);
        const res =  v1_neighbors?.has(v2) && v2_neighbors?.has(v1);
        if (this.verbose) console.log(`edge [${[v1,v2]}] ${res ? 'exists' : 'does not exist'}`);
        return res;
    }

    addVertex(v : vertex) : boolean {
        if (this.size() < this.max_size && !this.exists(v)) {
            this.adjTable.set(v, new Set());
            if (this.verbose) console.log(`adding vertex ${v}`);
            return true;
        }
        if (this.verbose) console.log(`failed to add vertex ${v}`);

        return false;
    }

    //should only be called if v1 and v2 are in the graph
    private _addEdge([v1,v2]: edge) {
        this.adjTable.get(v1).add(v2);
        this.adjTable.get(v2).add(v1);
    }
    
    addEdge([v1,v2] : edge) : boolean {
        let added = false;
        if (v1 !== v2) {
            let toAdd = 0;
            let addV1 = false;
            let addV2 = true;
            if (!this.exists(v1)) { toAdd++; addV1 = true};
            if (!this.exists(v2)) { toAdd++; addV2 = true};
            if (toAdd === 0) {
                this._addEdge([v1,v2]);
                added = true;
            } else {
                if (this.size() + toAdd <= this.max_size) {
                    if (addV1) this.addVertex(v1);
                    if (addV2) this.addVertex(v2);
                    this._addEdge([v1,v2]);
                    added = true;
                }
            }
        }

        if (this.verbose) console.log(`${added ? 'added' : 'failed to add'} edge [${[v1,v2]}]`);
        return added;
    }

    removeVertex(v : vertex) : boolean {
        if (this.exists(v)) {
            if (this.verbose) console.log(`removing ${v}`);
            this.adjTable.forEach(neighborSet => {
                neighborSet.delete(v)
            });
            this.adjTable.delete(v);
            return true;
        } else {
            if (this.verbose) console.log(`failed to remove ${v}`);
            return false;
        }
    }

    private neighbors(v1 : vertex) {
        if (!this.exists(v1)) return new Set();
        return this.adjTable.get(v1);
    }

    removeEdge([v1,v2] : edge) : boolean {
        if (this.existsEdge([v1,v2])) {
            if (this.verbose) console.log(`removing [${[v1,v2]}]`);
            const v1_neighbors = this.neighbors(v1);
            const v2_neighbors = this.neighbors(v2);
            v1_neighbors.delete(v2);
            v2_neighbors.delete(v1);
            return true;
        } else {
            if (this.verbose) console.log(`failed to remove [${[v1,v2]}]`);
            return false;
        }
    }
}
